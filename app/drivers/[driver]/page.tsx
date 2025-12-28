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
                    <StatCard label="Total Points" value={profile.totalPoints} />
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="text-xs tracking-widest text-zinc-400">FINISH POSITIONS</div>
                    <div className="mt-2 text-lg font-semibold text-white">排名趋势</div>
                    <FinishChart
                        positions={profile.entries
                            .map((entry) => entry.finishPos)
                            .filter((pos): pos is number => typeof pos === "number")}
                    />
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

function FinishChart({ positions }: { positions: number[] }) {
    if (positions.length === 0) {
        return <div className="mt-4 text-sm text-zinc-400">暂无排名数据</div>;
    }

    const maxPos = Math.max(...positions, 1);
    const minPos = Math.min(...positions, 1);

    return (
        <div className="mt-4">
            <div className="flex items-end gap-2">
                {positions.map((pos, index) => {
                    const ratio = (maxPos - pos + 1) / (maxPos - minPos + 1);
                    const height = 40 + ratio * 100;
                    return (
                        <div key={`${pos}-${index}`} className="flex flex-col items-center gap-1">
                            <div
                                className="w-4 rounded-full bg-white/80"
                                style={{ height: `${height}px` }}
                                title={`P${pos}`}
                            />
                            <div className="text-[10px] text-zinc-400">P{pos}</div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-3 text-xs text-zinc-400">
                最佳排名 P{minPos} · 最差排名 P{maxPos}
            </div>
        </div>
    );
}
