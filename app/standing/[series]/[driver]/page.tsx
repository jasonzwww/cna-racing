import Link from "next/link";
import { notFound } from "next/navigation";
import { seriesCatalog, type SeriesKey } from "@/lib/series";
import { computeDriverStandings, loadSeriesResults } from "@/lib/resultsData";
import { gapDisplay } from "@/lib/raceFormatting";
import { formatLocal, pos1 } from "@/lib/iracingResult";

function parseSeriesKey(key: string): SeriesKey | null {
    return (seriesCatalog.find((series) => series.key === key)?.key ?? null) as SeriesKey | null;
}

export default async function StandingDriverPage({
    params,
}: {
    params: { series: string; driver: string };
}) {
    const seriesKey = parseSeriesKey(params.series);
    if (!seriesKey) return notFound();

    const series = seriesCatalog.find((item) => item.key === seriesKey);
    if (!series) return notFound();

    const races = await loadSeriesResults(seriesKey);
    const standings = computeDriverStandings(races);
    const driverId = decodeURIComponent(params.driver);

    const driverStanding = standings.find((entry) => entry.custId === driverId);
    if (!driverStanding) return notFound();

    const raceEntries = races.flatMap((race) => {
        const session = race.raceSession;
        if (!session?.results?.length) return [];
        const rows = session.results;
        const row = rows.find((item) => String(item.cust_id ?? "") === driverId);
        if (!row) return [];

        const finishPos = row.finish_position ?? row.position;
        const posText = finishPos !== undefined ? pos1(row) : "—";

        return [
            {
                id: String(race.entry.id),
                title: race.entry.title,
                track: race.entry.track?.trim() || race.data.track?.track_name || "Unknown Track",
                layout: race.entry.layout?.trim() || race.data.track?.config_name || "Layout",
                startTime: race.startTime,
                finishPos: posText,
                carName: row.car_name ?? "—",
                incidents: row.incidents ?? 0,
                interval: gapDisplay(row),
            },
        ];
    });

    const avgFinish = raceEntries.length
        ? (
              raceEntries.reduce((sum, entry) => {
                  const value = Number(entry.finishPos);
                  return sum + (Number.isFinite(value) ? value : 0);
              }, 0) / raceEntries.length
          ).toFixed(1)
        : "—";

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-12">
                <Link
                    href="/standing"
                    className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                    ← Back to Standings
                </Link>

                <div className="mt-6">
                    <div className="text-xs tracking-widest text-zinc-400">{series.seriesName}</div>
                    <h1 className="mt-2 text-3xl md:text-4xl font-semibold">{driverStanding.driver}</h1>
                    <div className="mt-2 text-sm text-zinc-300">
                        {series.seasonName} · {driverStanding.team}
                    </div>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-4">
                    <StatCard label="Points" value={driverStanding.points} />
                    <StatCard label="Starts" value={driverStanding.starts} />
                    <StatCard label="Wins" value={driverStanding.wins} />
                    <StatCard label="Avg Finish" value={avgFinish} />
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                        <div className="text-lg font-semibold text-zinc-100">Race History</div>
                        <div className="text-sm text-zinc-400">Entries: {raceEntries.length}</div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Event</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Track</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Start</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Finish</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Interval</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Car</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Inc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {raceEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-zinc-200">{entry.title}</td>
                                        <td className="px-4 py-3 text-zinc-200">
                                            {entry.track} · {entry.layout}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200">
                                            {entry.startTime ? formatLocal(entry.startTime) : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">{entry.finishPos}</td>
                                        <td className="px-4 py-3 text-zinc-200 font-mono">{entry.interval}</td>
                                        <td className="px-4 py-3 text-zinc-200">{entry.carName}</td>
                                        <td className="px-4 py-3 text-zinc-200">{entry.incidents}</td>
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
