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

    const chartEntries = profile.entries
        .slice()
        .sort((a, b) => {
            const at = a.startTime ? Date.parse(a.startTime) : 0;
            const bt = b.startTime ? Date.parse(b.startTime) : 0;
            return at - bt;
        })
        .filter((entry) => typeof entry.finishPos === "number");

    const maxPos = chartEntries.length
        ? Math.max(...chartEntries.map((entry) => entry.finishPos ?? 0), 1)
        : 1;

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

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <StatCard label="iRating" value={profile.irating ?? "—"} />
                    <StatCard label="Safety Rating" value={profile.safetyRating ?? "—"} />
                    <StatCard label="Starts" value={profile.starts} />
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs tracking-widest text-zinc-400">FINISH TREND</div>
                            <div className="text-lg font-semibold text-white">排名走势</div>
                        </div>
                        <div className="text-xs text-zinc-400">Lower is better</div>
                    </div>

                    {chartEntries.length === 0 ? (
                        <div className="mt-4 text-sm text-zinc-400">暂无排名数据</div>
                    ) : (
                        <div className="mt-6 flex h-40 items-end gap-2">
                            {chartEntries.map((entry, index) => {
                                const value = entry.finishPos ?? maxPos;
                                const height = Math.max(10, ((maxPos - value + 1) / maxPos) * 100);

                                return (
                                    <div key={`${entry.seriesKey}-${entry.raceId}-${index}`} className="flex-1">
                                        <div
                                            className="w-full rounded-xl bg-gradient-to-t from-red-500/70 to-white/60"
                                            style={{ height: `${height}%` }}
                                            title={`${entry.title} · P${entry.finishPos}`}
                                        />
                                        <div className="mt-2 text-center text-[10px] text-zinc-400">
                                            P{entry.finishPos}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
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
