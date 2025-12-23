import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import {
    unwrapIRacingEvent,
    getSession,
    sortByFinishPosition,
} from "@/lib/iracingResult";

type IndexEntry = {
    id: string | number;
    title: string;
    track?: string;
    layout?: string;
    file: string;
    cover?: string;
};

async function readJsonFromPublic<T>(publicPath: string): Promise<T> {
    const full = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    const raw = await fs.readFile(full, "utf-8");
    return JSON.parse(raw) as T;
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

type StandingRow = {
    cust_id: number | string;
    name: string;
    starts: number;
    wins: number;
    podiums: number;
    points: number;
};

export default async function RookieStandingsPage() {
    const index = await readJsonFromPublic<IndexEntry[]>("/rookie/results/index.json");

    // 汇总表：cust_id -> StandingRow
    const map = new Map<string, StandingRow>();

    for (const e of index) {
        const json = await readJsonFromPublic<any>(e.file);
        const data = unwrapIRacingEvent(json);
        if (!data) continue;

        const race = getSession(data, "RACE");
        if (!race?.results?.length) continue;

        const rows = sortByFinishPosition(race.results);

        for (const r of rows) {
            const id = String(r.cust_id ?? "");
            if (!id) continue;

            const name = r.display_name ?? "Unknown";
            const pos = (r.finish_position ?? r.position ?? 9999) + 1;

            const cur =
                map.get(id) ??
                ({
                    cust_id: r.cust_id,
                    name,
                    starts: 0,
                    wins: 0,
                    podiums: 0,
                    points: 0,
                } as StandingRow);

            cur.name = name;
            cur.starts += 1;
            if (pos === 1) cur.wins += 1;
            if (pos <= 3) cur.podiums += 1;

            cur.points += pointsValue(r);

            map.set(id, cur);
        }
    }

    const standings = Array.from(map.values()).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.podiums !== a.podiums) return b.podiums - a.podiums;
        return String(a.name).localeCompare(String(b.name));
    });

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA ROOKIE</div>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                            Standings <span className="opacity-90">积分</span>
                        </h1>
                        <p className="mt-3 text-sm text-zinc-300">
                            自动从每场比赛 JSON 读取 points 并汇总（字段名不同也尽量兼容）。
                        </p>
                    </div>

                    <Link
                        href="/rookie"
                        className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back to Rookie
                    </Link>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                        <div className="text-sm text-zinc-400">Drivers: {standings.length}</div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-zinc-200">Rank</th>
                                <th className="px-4 py-3 text-left font-semibold text-zinc-200">Driver</th>
                                <th className="px-4 py-3 text-left font-semibold text-zinc-200">Starts</th>
                                <th className="px-4 py-3 text-left font-semibold text-zinc-200">Wins</th>
                                <th className="px-4 py-3 text-left font-semibold text-zinc-200">Podiums</th>
                                <th className="px-4 py-3 text-left font-semibold text-zinc-200">Points</th>
                            </tr>
                            </thead>

                            <tbody>
                            {standings.map((s, i) => (
                                <tr key={String(s.cust_id)} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3 text-zinc-200 font-semibold">{i + 1}</td>
                                    <td className="px-4 py-3 text-zinc-200">{s.name}</td>
                                    <td className="px-4 py-3 text-zinc-200">{s.starts}</td>
                                    <td className="px-4 py-3 text-zinc-200">{s.wins}</td>
                                    <td className="px-4 py-3 text-zinc-200">{s.podiums}</td>
                                    <td className="px-4 py-3 text-zinc-100 font-extrabold">{s.points}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {standings.length === 0 && (
                        <div className="px-6 py-6 text-zinc-300">
                            还没有可用的结果数据（请先在 public/rookie/results/index.json 加入比赛）。
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
