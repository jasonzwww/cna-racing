import fs from "fs/promises";
import path from "path";

import DriversClient, { DriverProfile } from "./DriversClient";
import { defaultPoints, normalizeName, pointsForPosition } from "@/lib/points";
import { getSession, IRacingEventResult, IRacingEventResultFile, sortByFinishPosition, unwrapIRacingEvent } from "@/lib/iracingResult";

type IndexEntry = {
    id: string;
    title: string;
    date?: string;
    track?: string;
    layout?: string;
    file: string;
    cover?: string;
};

type SeriesSource = {
    key: string;
    label: string;
    indexPath: string;
};

type LicenseEntry = {
    category?: string;
    category_id?: number;
    irating?: number;
    safety_rating?: number;
};

type LicenseMap = Record<string, LicenseEntry[]>;

type DriverAccumulator = {
    name: string;
    points: number;
    starts: number;
    irating?: number | null;
    safetyRating?: number | null;
    series: Set<string>;
    lastRace?: {
        series: string;
        track: string;
        date?: string;
        timestamp?: number;
    } | null;
};

async function readJsonFromPublic<T>(publicPath: string): Promise<T | null> {
    try {
        const full = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
        const raw = await fs.readFile(full, "utf-8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

function selectSportsCarLicense(licenses?: LicenseEntry[]) {
    if (!licenses?.length) return null;
    return (
        licenses.find((license) => license.category === "sports_car" || license.category_id === 5) ??
        licenses[0]
    );
}

function buildRaceTimestamp(entry: IndexEntry, event: IRacingEventResult) {
    if (entry.date) {
        const t = Date.parse(entry.date);
        if (Number.isFinite(t)) return t;
    }

    if (event?.start_time) {
        const t = Date.parse(event.start_time);
        if (Number.isFinite(t)) return t;
    }

    return undefined;
}

export default async function DriversPage() {
    const sources: SeriesSource[] = [
        { key: "gt3open", label: "GT3 Open", indexPath: "/gt3open/results/index.json" },
        { key: "rookie", label: "Rookie", indexPath: "/rookie/results/index.json" },
    ];

    const drivers = new Map<string, DriverAccumulator>();

    for (const source of sources) {
        const index = (await readJsonFromPublic<IndexEntry[]>(source.indexPath)) ?? [];

        for (const entry of index) {
            const json = await readJsonFromPublic<IRacingEventResultFile | any>(entry.file);
            const data = unwrapIRacingEvent(json);

            if (!data) continue;

            const race = getSession(data, "RACE");
            if (!race?.results?.length) continue;

            const rows = sortByFinishPosition(race.results);
            const licenseMap = (data as { driver_licenses?: LicenseMap }).driver_licenses;
            const raceTimestamp = buildRaceTimestamp(entry, data);
            const trackLabel = entry.track ?? data.track?.track_name ?? "Unknown";

            rows.forEach((row, indexPos) => {
                const name = normalizeName(row.display_name ?? "Unknown Driver");
                const points =
                    typeof row.champ_points === "number" && Number.isFinite(row.champ_points)
                        ? row.champ_points
                        : pointsForPosition(indexPos + 1, defaultPoints);
                const custId = row.cust_id ? String(row.cust_id) : undefined;
                const license = custId ? selectSportsCarLicense(licenseMap?.[custId]) : null;

                const current =
                    drivers.get(name) ??
                    ({
                        name,
                        points: 0,
                        starts: 0,
                        irating: null,
                        safetyRating: null,
                        series: new Set<string>(),
                        lastRace: null,
                    } satisfies DriverAccumulator);

                current.points += points;
                current.starts += 1;
                current.series.add(source.label);

                if (license) {
                    current.irating = license.irating ?? current.irating ?? null;
                    current.safetyRating = license.safety_rating ?? current.safetyRating ?? null;
                }

                if (raceTimestamp) {
                    const prev = current.lastRace?.timestamp ?? 0;
                    if (!prev || raceTimestamp >= prev) {
                        current.lastRace = {
                            series: source.label,
                            track: trackLabel,
                            date: entry.date ?? data.start_time,
                            timestamp: raceTimestamp,
                        };
                    }
                }

                drivers.set(name, current);
            });
        }
    }

    const driverList: DriverProfile[] = Array.from(drivers.values()).map((driver) => ({
        name: driver.name,
        points: Math.round(driver.points),
        starts: driver.starts,
        irating: driver.irating ?? null,
        safetyRating: driver.safetyRating ?? null,
        series: Array.from(driver.series.values()).sort(),
        lastRace: driver.lastRace
            ? {
                series: driver.lastRace.series,
                track: driver.lastRace.track,
                date: driver.lastRace.date,
            }
            : null,
    }));

    driverList.sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-2">
                    <div className="text-xs tracking-widest text-zinc-400">CNA DRIVERS</div>
                    <h1 className="text-3xl font-semibold tracking-tight">车手名录</h1>
                    <p className="max-w-2xl text-sm text-zinc-400">
                        所有参与过 CNA 比赛的车手都会展示在这里。数据来源于官方结果 JSON。
                    </p>
                </div>

                <DriversClient drivers={driverList} />
            </div>
        </main>
    );
}
