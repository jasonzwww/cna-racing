import fs from "fs/promises";
import path from "path";
import {
    getSession,
    IRacingDriverRow,
    IRacingEventResult,
    sortByFinishPosition,
    unwrapIRacingEvent,
} from "@/lib/iracingResult";
import { defaultPoints, normalizeName, pointsForPosition } from "@/lib/points";
import { driverToTeam } from "@/data/teams";
import { SeriesKey, getSeriesDefinition } from "@/lib/series";

export type ResultsIndexEntry = {
    id: string | number;
    title: string;
    date?: string;
    track?: string;
    layout?: string;
    file: string;
    cover?: string;
};

export type RaceResult = {
    seriesKey: SeriesKey;
    entry: ResultsIndexEntry;
    data: IRacingEventResult;
    startTime?: string;
    seasonName: string;
    seriesName: string;
    raceSession: ReturnType<typeof getSession> | null;
};

export type DriverStanding = {
    custId: string;
    driver: string;
    team: string;
    points: number;
    starts: number;
    wins: number;
    podiums: number;
};

export type DriverRaceEntry = {
    seriesKey: SeriesKey;
    seriesName: string;
    seasonName: string;
    raceId: string;
    track: string;
    layout: string;
    title: string;
    startTime?: string;
    finishPos: number | null;
    carName?: string;
    incidents?: number;
    interval?: number | null;
    points: number;
};

export type DriverProfile = {
    custId: string;
    name: string;
    seriesKeys: Set<SeriesKey>;
    starts: number;
    totalPoints: number;
    lastRaceAt?: string;
    lastRaceLabel?: string;
    irating?: number;
    safetyRating?: number;
    licenseGroup?: string;
    entries: DriverRaceEntry[];
};

export async function readJsonFromPublic<T>(publicPath: string): Promise<T | null> {
    try {
        const full = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
        const raw = await fs.readFile(full, "utf-8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export function getIndexPath(seriesKey: SeriesKey) {
    switch (seriesKey) {
        case "gt3open":
            return "/gt3open/results/index.json";
        case "rookie":
            return "/rookie/results/index.json";
        default:
            return "/gt3open/results/index.json";
    }
}

export async function loadSeriesResults(seriesKey: SeriesKey): Promise<RaceResult[]> {
    const index = (await readJsonFromPublic<ResultsIndexEntry[]>(getIndexPath(seriesKey))) ?? [];
    const seriesDefinition = getSeriesDefinition(seriesKey);
    const seriesNameFallback = seriesDefinition?.seriesName ?? seriesKey;
    const seasonFallback = seriesDefinition?.seasonName ?? "Current Season";

    const races = await Promise.all(
        index.map(async (entry) => {
            const json = await readJsonFromPublic<any>(entry.file);
            const data = unwrapIRacingEvent(json);
            if (!data) return null;

            const startTime = data.start_time ?? entry.date;
            const seasonName = data.season_name ?? seasonFallback;
            const seriesName = data.series_name ?? seriesNameFallback;

            return {
                seriesKey,
                entry,
                data,
                startTime,
                seasonName,
                seriesName,
                raceSession: getSession(data, "RACE"),
            } as RaceResult;
        })
    );

    return races.filter((race): race is RaceResult => Boolean(race));
}

export function computeDriverStandings(races: RaceResult[]): DriverStanding[] {
    const driverMap = new Map<string, DriverStanding>();

    races.forEach((race) => {
        const session = race.raceSession;
        if (!session?.results?.length) return;

        const rows = sortByFinishPosition(session.results);

        rows.forEach((row, index) => {
            const driverName = normalizeName(row.display_name ?? "Unknown Driver");
            const custId = row.cust_id ? String(row.cust_id) : driverName;
            const team = driverToTeam[driverName] ?? "—";

            const pos1 = index + 1;
            const jsonPoints =
                typeof row.champ_points === "number" && Number.isFinite(row.champ_points)
                    ? row.champ_points
                    : null;
            const points = jsonPoints ?? pointsForPosition(pos1, defaultPoints);

            const current =
                driverMap.get(custId) ??
                ({
                    custId,
                    driver: driverName,
                    team,
                    points: 0,
                    starts: 0,
                    wins: 0,
                    podiums: 0,
                } as DriverStanding);

            current.driver = driverName;
            current.team = team;
            current.points += points;
            current.starts += 1;
            if (pos1 === 1) current.wins += 1;
            if (pos1 <= 3) current.podiums += 1;

            driverMap.set(custId, current);
        });
    });

    return Array.from(driverMap.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.podiums !== a.podiums) return b.podiums - a.podiums;
        return a.driver.localeCompare(b.driver);
    });
}

export function groupRacesBySeason(races: RaceResult[]) {
    const map = new Map<string, RaceResult[]>();
    races.forEach((race) => {
        const key = race.seasonName;
        const bucket = map.get(key) ?? [];
        bucket.push(race);
        map.set(key, bucket);
    });
    return map;
}

export function getSeasonOrder(races: RaceResult[]) {
    const withDates = races
        .map((race) => ({
            seasonName: race.seasonName,
            startTime: race.startTime ? Date.parse(race.startTime) : NaN,
        }))
        .filter((r) => Number.isFinite(r.startTime));

    const seasonLatest = new Map<string, number>();
    withDates.forEach((item) => {
        const current = seasonLatest.get(item.seasonName) ?? 0;
        seasonLatest.set(item.seasonName, Math.max(current, item.startTime));
    });

    return Array.from(seasonLatest.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([seasonName]) => seasonName);
}

export function getDriverRowSummary(row: IRacingDriverRow) {
    const finishPos = row.finish_position ?? row.position;
    return {
        finishPos: typeof finishPos === "number" ? finishPos + 1 : null,
        incidents: row.incidents ?? 0,
    };
}

function pickSportsCarLicense(data: any, custId: string) {
    const licenses = data?.driver_licenses?.[custId];
    if (!Array.isArray(licenses)) return null;
    return (
        licenses.find((entry) => entry.category === "sports_car") ??
        licenses.find((entry) => entry.category_id === 5)
    );
}

function trackLabel(entry: ResultsIndexEntry, data: IRacingEventResult) {
    return entry.track?.trim() || data.track?.track_name || "Unknown Track";
}

function layoutLabel(entry: ResultsIndexEntry, data: IRacingEventResult) {
    return entry.layout?.trim() || data.track?.config_name || "Layout";
}

export function buildDriverProfiles(races: RaceResult[]) {
    const profileMap = new Map<string, DriverProfile>();

    races.forEach((race) => {
        const session = race.raceSession;
        if (!session?.results?.length) return;

        const track = trackLabel(race.entry, race.data);
        const layout = layoutLabel(race.entry, race.data);

        const sorted = sortByFinishPosition(session.results);

        sorted.forEach((row, index) => {
            const name = normalizeName(row.display_name ?? "Unknown Driver");
            const custId = row.cust_id ? String(row.cust_id) : name;
            const pos1 = index + 1;
            const jsonPoints =
                typeof row.champ_points === "number" && Number.isFinite(row.champ_points)
                    ? row.champ_points
                    : null;
            const points = jsonPoints ?? pointsForPosition(pos1, defaultPoints);

            const profile =
                profileMap.get(custId) ??
                ({
                    custId,
                    name,
                    seriesKeys: new Set(),
                    starts: 0,
                    totalPoints: 0,
                    entries: [],
                } as DriverProfile);

            profile.name = name;
            profile.seriesKeys.add(race.seriesKey);
            profile.starts += 1;
            profile.totalPoints += points;

            const startTime = race.startTime;
            if (startTime) {
                const currentTime = profile.lastRaceAt ? Date.parse(profile.lastRaceAt) : 0;
                const newTime = Date.parse(startTime);
                if (Number.isFinite(newTime) && newTime >= currentTime) {
                    profile.lastRaceAt = startTime;
                    profile.lastRaceLabel = `${race.seriesName} · ${track}`;

                    const license = pickSportsCarLicense(race.data as any, custId);
                    if (license) {
                        profile.irating = license.irating ?? profile.irating;
                        profile.safetyRating = license.safety_rating ?? profile.safetyRating;
                        profile.licenseGroup = license.group_name ?? profile.licenseGroup;
                    }
                }
            }

            const finishPos = row.finish_position ?? row.position;

            profile.entries.push({
                seriesKey: race.seriesKey,
                seriesName: race.seriesName,
                seasonName: race.seasonName,
                raceId: String(race.entry.id),
                track,
                layout,
                title: race.entry.title,
                startTime,
                finishPos: typeof finishPos === "number" ? finishPos + 1 : null,
                carName: row.car_name,
                incidents: row.incidents ?? 0,
                interval: typeof row.interval === "number" ? row.interval : null,
                points,
            });

            profileMap.set(custId, profile);
        });
    });

    return Array.from(profileMap.values()).map((profile) => ({
        ...profile,
        seriesKeys: new Set(profile.seriesKeys),
        entries: profile.entries.sort((a, b) => {
            const at = a.startTime ? Date.parse(a.startTime) : 0;
            const bt = b.startTime ? Date.parse(b.startTime) : 0;
            return bt - at;
        }),
    }));
}
