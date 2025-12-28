import Link from "next/link";
import { notFound } from "next/navigation";
import { buildDriverProfiles, loadSeriesResults } from "@/lib/resultsData";
import { seriesCatalog } from "@/lib/series";
import { formatLocal } from "@/lib/iracingResult";
import { gapDisplay } from "@/lib/raceFormatting";

export default async function ProfilePage() {
    const allRaces = (
        await Promise.all(seriesCatalog.map((series) => loadSeriesResults(series.key)))
    ).flat();

    const profiles = buildDriverProfiles(allRaces);
    const profile = profiles[0];

    if (!profile) return notFound();

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">MY PROFILE</div>
                        <h1 className="mt-2 text-3xl md:text-4xl font-semibold">{profile.name}</h1>
                        <p className="mt-2 text-sm text-zinc-300">
                            这是基于当前结果 JSON 的示例个人主页。登录后可显示真实用户数据。
                        </p>
                    </div>
                    <Link
                        href="/drivers"
                        className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                        View All Drivers
                    </Link>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <StatCard label="iRating" value={profile.irating ?? "—"} />
                    <StatCard label="Safety Rating" value={profile.safetyRating ?? "—"} />
                    <StatCard label="Total Points" value={profile.totalPoints} />
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                        <div className="text-lg font-semibold text-zinc-100">Recent Races</div>
                        <div className="text-sm text-zinc-400">Entries: {profile.entries.length}</div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Series</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Event</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Start</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Finish</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Interval</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Car</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profile.entries.slice(0, 5).map((entry) => (
                                    <tr key={`${entry.seriesKey}-${entry.raceId}`} className="border-b border-white/5 hover:bg-white/5">
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
