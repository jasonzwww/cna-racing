import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import {
    unwrapIRacingEvent,
    getSession,
    sortByFinishPosition,
    pos1,
    msToClock,
    formatLocal,
} from "@/lib/iracingResult";

type IndexEntry = {
    id: string | number;
    title: string;
    date?: string;
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

export default async function GT3ResultDetailPage({
                                                      params,
                                                  }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const routeId = decodeURIComponent(String(id ?? "")).trim();


    const index = await readJsonFromPublic<IndexEntry[]>("/gt3open/results/index.json");

    // ✅ index.json 里的 id 也统一 trim 成字符串
    const entry = index.find((e) => String(e.id).trim() === routeId);

    if (!entry) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <div className="mx-auto max-w-6xl px-6 py-12">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="text-lg font-semibold">Result not found</div>
                        <p className="mt-2 text-zinc-300">
                            index.json 里没有这个 id：<span className="font-semibold">{routeId || "(empty)"}</span>
                        </p>
                        <div className="mt-2 text-xs text-zinc-400">
                            Tip: 你现在访问的 URL 应该是 /gt3open/results/&lt;id&gt;
                        </div>
                        <Link
                            href="/gt3open/results"
                            className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                        >
                            Back to Results
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // ✅ 兼容 iRacing JSON 两种顶层格式（有无 data）
    const json = await readJsonFromPublic<any>(entry.file);
    const data = unwrapIRacingEvent(json);

    if (!data) {
        return (
            <main className="min-h-screen bg-zinc-950 text-zinc-100">
                <div className="mx-auto max-w-6xl px-6 py-12">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="text-lg font-semibold">Invalid result file</div>
                        <p className="mt-2 text-zinc-300">
                            读取到了文件但解析不到 iRacing 结果结构：{entry.file}
                        </p>
                        <Link
                            href="/gt3open/results"
                            className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                        >
                            Back to Results
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const trackName = data?.track?.track_name ?? entry.track ?? "Unknown Track";
    const layout = data?.track?.config_name ?? entry.layout ?? "Layout";
    const series = data?.series_name ?? "GT3 Open";
    const start = data?.start_time;

    const quali = getSession(data, "QUALIFY");
    const race = getSession(data, "RACE");

    const raceRows = race ? sortByFinishPosition(race.results ?? []) : [];
    const qualiRows = quali ? sortByFinishPosition(quali.results ?? []) : [];

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">{series}</div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            {trackName} — Full Results
                        </h1>
                        <div className="mt-2 text-sm text-zinc-300">
                            🏁 {layout} <span className="text-zinc-500">·</span> 🕒 {formatLocal(start)}
                            <span className="text-zinc-500"> · </span>
                            <span className="text-zinc-400">ID:</span>{" "}
                            <span className="font-semibold text-zinc-100">{String(entry.id).trim()}</span>
                        </div>
                    </div>

                    <Link
                        href="/gt3open/results"
                        className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back
                    </Link>
                </div>

                {entry.cover && (
                    <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
                        <div
                            className="h-56 md:h-72 bg-cover bg-center"
                            style={{ backgroundImage: `url('${entry.cover}')` }}
                        />
                    </div>
                )}

                <SectionTable title="QUALIFY" subtitle={quali?.simsession_type_name ?? "Qualifying"} rows={qualiRows} />
                <SectionTable title="RACE" subtitle={race?.simsession_type_name ?? "Race"} rows={raceRows} showInterval />
            </div>
        </main>
    );
}

function SectionTable({
                          title,
                          subtitle,
                          rows,
                          showInterval,
                      }: {
    title: string;
    subtitle: string;
    rows: any[];
    showInterval?: boolean;
}) {
    return (
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div>
                    <div className="text-lg font-semibold text-zinc-100">{title}</div>
                    <div className="text-sm text-zinc-400">{subtitle}</div>
                </div>
                <div className="text-sm text-zinc-400">Rows: {rows.length}</div>
            </div>

            <div className="overflow-auto">
                <table className="min-w-[1000px] w-full text-sm">
                    <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pos</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Driver</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Car</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Laps</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Inc</th>
                        {showInterval && (
                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Interval</th>
                        )}
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Best Lap</th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">Reason</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((r: any) => (
                        <tr
                            key={`${r.cust_id}-${r.finish_position ?? r.position}`}
                            className="border-b border-white/5 hover:bg-white/5"
                        >
                            <td className="px-4 py-3 text-zinc-200 font-semibold">{pos1(r)}</td>
                            <td className="px-4 py-3 text-zinc-200">{r.display_name ?? "—"}</td>
                            <td className="px-4 py-3 text-zinc-200">{r.car_name ?? "—"}</td>
                            <td className="px-4 py-3 text-zinc-200">{r.laps_complete ?? "—"}</td>
                            <td className="px-4 py-3 text-zinc-200">{r.incidents ?? "—"}</td>
                            {showInterval && (
                                <td className="px-4 py-3 text-zinc-200 font-mono">
                                    {r.interval === 0 ? "WIN" : msToClock(r.interval)}
                                </td>
                            )}
                            <td className="px-4 py-3 text-zinc-200 font-mono">{msToClock(r.best_lap_time)}</td>
                            <td className="px-4 py-3 text-zinc-200">{r.reason_out ?? "—"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {rows.length === 0 && (
                <div className="px-6 py-6 text-zinc-300">No results found in this session.</div>
            )}
        </div>
    );
}
