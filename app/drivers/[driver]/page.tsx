import Link from "next/link";
import { notFound } from "next/navigation";
import { gapDisplay } from "@/lib/raceFormatting";
import { formatLocal } from "@/lib/iracingResult";
import { buildDriverProfiles, loadSeriesResults } from "@/lib/resultsData";
import { seriesCatalog } from "@/lib/series";

export default async function DriverDetailPage({
    params,
}: {
    params: { driver: string };
}) {
    const allRaces = (
        await Promise.all(seriesCatalog.map((series) => loadSeriesResults(series.key)))
    ).flat();

    const profiles = buildDriverProfiles(allRaces);
    const driverId = decodeURIComponent(params.driver);
    const profile = profiles.find((item) => item.custId === driverId);

    if (!profile) return notFound();

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-12">
                <Link
                    href="/drivers"
                    className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                    ← Back to Drivers
                </Link>

                <div className="mt-6">
                    <div className="text-xs tracking-widest text-zinc-400">CNA DRIVER PROFILE</div>
                    <h1 className="mt-2 text-3xl md:text-4xl font-semibold">{profile.name}</h1>
                    <div className="mt-2 text-sm text-zinc-300">
                        系列: {Array.from(profile.seriesKeys).join(" / ")}
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <StatCard label="iRating" value={profile.irating ?? "—"} />
                    <StatCard label="Safety Rating" value={profile.safetyRating ?? "—"} />
                    <StatCard label="Starts" value={profile.starts} />
                    <StatCard label="CNA Points" value={profile.totalPoints} />
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="text-sm font-semibold text-zinc-100">Ranking Trend</div>
                    <div className="mt-2 text-xs text-zinc-400">
                        越接近 1 表示名次越靠前（仅统计完成比赛的场次）
                    </div>
                    <RankingChart entries={profile.entries} />
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                        <div className="text-lg font-semibold text-zinc-100">Race History</div>
                        <div className="text-sm text-zinc-400">Entries: {profile.entries.length}</div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Season</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Series</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Event</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Start</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Finish</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Interval</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Car</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Inc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profile.entries.map((entry) => (
                                    <tr key={`${entry.seriesKey}-${entry.raceId}`} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-zinc-200">{entry.seasonName}</td>
                                        <td className="px-4 py-3 text-zinc-200">{entry.seriesName}</td>
                                        <td className="px-4 py-3 text-zinc-200">{entry.title}</td>
                                        <td className="px-4 py-3 text-zinc-200">
                                            {entry.startTime ? formatLocal(entry.startTime) : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">
                                            {entry.finishPos ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200 font-mono">
                                            {entry.interval ? gapDisplay({ interval: entry.interval }) : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200">{entry.carName ?? "—"}</td>
                                        <td className="px-4 py-3 text-zinc-200">{entry.incidents ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs tracking-widest text-zinc-400">{label}</div>
            <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
        </div>
    );
}

function RankingChart({
    entries,
}: {
    entries: Array<{ finishPos: number | null; startTime?: string }>;
}) {
    const sorted = entries
        .slice()
        .filter((entry) => entry.finishPos && entry.finishPos > 0)
        .sort((a, b) => {
            const at = a.startTime ? Date.parse(a.startTime) : 0;
            const bt = b.startTime ? Date.parse(b.startTime) : 0;
            return at - bt;
        });

    if (sorted.length === 0) {
        return <div className="mt-4 text-sm text-zinc-400">暂无可用排名数据</div>;
    }

    const maxPos = Math.max(...sorted.map((entry) => entry.finishPos ?? 0), 1);
    const width = 640;
    const height = 160;
    const padding = 24;

    const points = sorted.map((entry, index) => {
        const x = padding + (index / Math.max(sorted.length - 1, 1)) * (width - padding * 2);
        const pos = entry.finishPos ?? maxPos;
        const y =
            padding + ((pos - 1) / Math.max(maxPos - 1, 1)) * (height - padding * 2);
        return `${x},${y}`;
    });

    return (
        <div className="mt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    rx={16}
                    fill="rgba(0,0,0,0.25)"
                />
                <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={height - padding}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1}
                />
                <line
                    x1={padding}
                    y1={height - padding}
                    x2={width - padding}
                    y2={height - padding}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1}
                />
                <polyline
                    points={points.join(" ")}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={2}
                />
                {points.map((point, index) => {
                    const [x, y] = point.split(",").map(Number);
                    return <circle key={index} cx={x} cy={y} r={3} fill="#f87171" />;
                })}
            </svg>
        </div>
    );
}
