import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { getSession, sortByFinishPosition, unwrapIRacingEvent } from "@/lib/iracingResult";
import { defaultPoints, normalizeName, pointsForPosition } from "@/lib/points";
import { driverToTeam } from "@/data/teams";

type StandingPageProps = {
    searchParams?: Promise<{
        series?: string;
    }>;
};

type Gt3IndexEntry = {
    id: string;
    title: string;
    date?: string;
    track?: string;
    layout?: string;
    file: string;
    cover?: string;
};

type RookieIndexEntry = {
    id: string | number;
    title: string;
    track?: string;
    layout?: string;
    file: string;
    cover?: string;
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

function pointsValue(r: any) {
    const candidates = [
        "championship_points",
        "champ_points",
        "points",
        "race_points",
        "new_points",
        "pos_points",
    ];
    for (const k of candidates) {
        const v = r?.[k];
        if (typeof v === "number" && Number.isFinite(v)) return v;
    }
    return 0;
}

type DriverStanding = {
    name: string;
    team?: string;
    points: number;
    starts: number;
    wins: number;
    podiums: number;
};

type TeamStanding = {
    team: string;
    points: number;
    wins: number;
    podiums: number;
};

async function loadGt3Standings() {
    const index = (await readJsonFromPublic<Gt3IndexEntry[]>("/gt3open/results/index.json")) ?? [];

    const driverMap = new Map<string, DriverStanding>();

    for (const entry of index) {
        const json = await readJsonFromPublic<any>(entry.file);
        const data = unwrapIRacingEvent(json);
        if (!data) continue;

        const race = getSession(data, "RACE");
        if (!race?.results?.length) continue;

        const rows = sortByFinishPosition(race.results);

        rows.forEach((r, i) => {
            const name = normalizeName(r.display_name ?? "Unknown Driver");
            const team = driverToTeam[name] ?? "—";
            const pos1 = i + 1;
            const jsonPoints =
                typeof r.champ_points === "number" && Number.isFinite(r.champ_points)
                    ? r.champ_points
                    : null;
            const pts = jsonPoints ?? pointsForPosition(pos1, defaultPoints);

            const cur =
                driverMap.get(name) ??
                ({
                    name,
                    team,
                    points: 0,
                    starts: 0,
                    wins: 0,
                    podiums: 0,
                } as DriverStanding);

            cur.team = team;
            cur.points += pts;
            cur.starts += 1;
            if (pos1 === 1) cur.wins += 1;
            if (pos1 <= 3) cur.podiums += 1;

            driverMap.set(name, cur);
        });
    }

    const drivers = Array.from(driverMap.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.podiums !== a.podiums) return b.podiums - a.podiums;
        return a.name.localeCompare(b.name);
    });

    const teamMap = new Map<string, TeamStanding>();
    for (const driver of drivers) {
        const team = driver.team || "—";
        const cur = teamMap.get(team) ?? { team, points: 0, wins: 0, podiums: 0 };
        cur.points += driver.points;
        cur.wins += driver.wins;
        cur.podiums += driver.podiums;
        teamMap.set(team, cur);
    }

    const teams = Array.from(teamMap.values())
        .filter((team) => team.team !== "—")
        .sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.wins !== a.wins) return b.wins - a.wins;
            if (b.podiums !== a.podiums) return b.podiums - a.podiums;
            return a.team.localeCompare(b.team);
        });

    return { drivers, teams };
}

async function loadRookieStandings() {
    const index = (await readJsonFromPublic<RookieIndexEntry[]>("/rookie/results/index.json")) ?? [];
    const driverMap = new Map<string, DriverStanding>();

    for (const entry of index) {
        const json = await readJsonFromPublic<any>(entry.file);
        const data = unwrapIRacingEvent(json);
        if (!data) continue;

        const race = getSession(data, "RACE");
        if (!race?.results?.length) continue;

        const rows = sortByFinishPosition(race.results);

        for (const r of rows) {
            const id = String(r.cust_id ?? "");
            const name = r.display_name ?? "Unknown";
            const pos = (r.finish_position ?? r.position ?? 9999) + 1;
            const pts = pointsValue(r);

            const cur =
                driverMap.get(id) ??
                ({
                    name,
                    points: 0,
                    starts: 0,
                    wins: 0,
                    podiums: 0,
                } as DriverStanding);

            cur.name = name;
            cur.points += pts;
            cur.starts += 1;
            if (pos === 1) cur.wins += 1;
            if (pos <= 3) cur.podiums += 1;
            driverMap.set(id, cur);
        }
    }

    const drivers = Array.from(driverMap.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.podiums !== a.podiums) return b.podiums - a.podiums;
        return a.name.localeCompare(b.name);
    });

    return { drivers };
}

export default async function StandingPage({ searchParams }: StandingPageProps) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const activeSeries =
        resolvedSearchParams.series === "gt3open" || resolvedSearchParams.series === "rookie"
            ? resolvedSearchParams.series
            : "all";

    const [gt3Standings, rookieStandings] = await Promise.all([
        loadGt3Standings(),
        loadRookieStandings(),
    ]);

    const seriesBlocks = [
        {
            key: "gt3open",
            title: "GT3 Open 积分榜",
            icon: "🏎️",
            accent: "text-red-300",
            content: (
                <>
                    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                            <div className="text-sm text-zinc-400">Drivers: {gt3Standings.drivers.length}</div>
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-[900px] w-full text-sm">
                                <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pos</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Driver</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Team</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pts</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Starts</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Wins</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Podiums</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gt3Standings.drivers.map((driver, idx) => (
                                        <tr
                                            key={driver.name}
                                            className="border-b border-white/5 hover:bg-white/5"
                                        >
                                            <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                            <td className="px-4 py-3 text-zinc-200">{driver.name}</td>
                                            <td className="px-4 py-3 text-zinc-200">{driver.team}</td>
                                            <td className="px-4 py-3 text-zinc-200 font-semibold">
                                                {driver.points}
                                            </td>
                                            <td className="px-4 py-3 text-zinc-200">{driver.starts}</td>
                                            <td className="px-4 py-3 text-zinc-200">{driver.wins}</td>
                                            <td className="px-4 py-3 text-zinc-200">{driver.podiums}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {gt3Standings.drivers.length === 0 && (
                            <div className="px-6 py-6 text-zinc-300">
                                还没有 GT3 Open 结果数据。请在 public/gt3open/results 更新 JSON。
                            </div>
                        )}
                    </div>

                    <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <div className="text-lg font-semibold text-zinc-100">Team Standings</div>
                            <div className="text-sm text-zinc-400">Teams: {gt3Standings.teams.length}</div>
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-[700px] w-full text-sm">
                                <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pos</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Team</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pts</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Wins</th>
                                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Podiums</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gt3Standings.teams.map((team, idx) => (
                                        <tr key={team.team} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                            <td className="px-4 py-3 text-zinc-200">{team.team}</td>
                                            <td className="px-4 py-3 text-zinc-200 font-semibold">{team.points}</td>
                                            <td className="px-4 py-3 text-zinc-200">{team.wins}</td>
                                            <td className="px-4 py-3 text-zinc-200">{team.podiums}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {gt3Standings.teams.length === 0 && (
                            <div className="px-6 py-6 text-zinc-300">
                                还没有车队数据。请在 data/teams.ts 添加车手→车队映射。
                            </div>
                        )}
                    </div>
                </>
            ),
        },
        {
            key: "rookie",
            title: "新手赛 积分榜",
            icon: "⭐",
            accent: "text-sky-300",
            content: (
                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                        <div className="text-sm text-zinc-400">Drivers: {rookieStandings.drivers.length}</div>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-[700px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pos</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Driver</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pts</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Starts</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Wins</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Podiums</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rookieStandings.drivers.map((driver, idx) => (
                                    <tr key={`${driver.name}-${idx}`} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.name}</td>
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">{driver.points}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.starts}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.wins}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.podiums}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {rookieStandings.drivers.length === 0 && (
                        <div className="px-6 py-6 text-zinc-300">
                            还没有新手赛结果数据。请在 public/rookie/results 更新 JSON。
                        </div>
                    )}
                </div>
            ),
        },
    ];

    const visibleBlocks =
        activeSeries === "all" ? seriesBlocks : seriesBlocks.filter((block) => block.key === activeSeries);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">STANDING</p>
                    <h1 className="text-4xl font-semibold text-white">系列赛积分总榜</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        GT3 与新手赛积分榜将从官方 .json 文件读取并自动汇总。
                    </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {["all", "gt3open", "rookie"].map((key) => {
                        const label =
                            key === "all" ? "全部" : key === "gt3open" ? "GT3 Open" : "新手赛";
                        const icon = key === "gt3open" ? "🏎️" : key === "rookie" ? "⭐" : "📋";
                        const accent =
                            key === "gt3open" ? "text-red-300" : key === "rookie" ? "text-sky-300" : "text-zinc-200";
                        const href = key === "all" ? "/standing" : `/standing?series=${key}`;
                        return (
                            <Link
                                key={key}
                                href={href}
                                className={[
                                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                                    activeSeries === key
                                        ? "bg-white text-zinc-950"
                                        : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                                ].join(" ")}
                            >
                                <span className={"inline-flex items-center gap-2 " + accent}>
                                    <span>{icon}</span>
                                    {label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-8 grid gap-8">
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs tracking-widest text-zinc-400">GT3 OPEN</div>
                            <div className="mt-2 text-sm text-zinc-200">
                                进入 GT3 Open 积分榜（含队伍统计与详细数据）。
                            </div>
                            <Link
                                href="/gt3open/standings"
                                className="mt-3 inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                打开 GT3 Open 积分榜
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs tracking-widest text-zinc-400">ROOKIE</div>
                            <div className="mt-2 text-sm text-zinc-200">
                                进入新手赛积分榜（含比赛场次与名次统计）。
                            </div>
                            <Link
                                href="/rookie/standings"
                                className="mt-3 inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                打开 新手赛 积分榜
                            </Link>
                        </div>
                    </div>

                    {visibleBlocks.map((block) => (
                        <div key={block.key} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="flex items-center gap-3">
                                <span className={block.accent}>{block.icon}</span>
                                <div className="text-lg font-semibold text-white">{block.title}</div>
                            </div>
                            <div className="mt-6">{block.content}</div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
