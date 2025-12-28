import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarLogo } from "@/lib/carLogos";
import { gapDisplay } from "@/lib/raceFormatting";
import { formatLocal, pos1, sortByFinishPosition } from "@/lib/iracingResult";
import { seriesCatalog, type SeriesKey } from "@/lib/series";
import { loadSeriesResults } from "@/lib/resultsData";

function parseSeriesKey(key: string): SeriesKey | null {
    return (seriesCatalog.find((series) => series.key === key)?.key ?? null) as SeriesKey | null;
}

export default async function SeasonResultsPage({
    params,
}: {
    params: { series: string; season: string };
}) {
    const seriesKey = parseSeriesKey(params.series);
    if (!seriesKey) return notFound();

    const series = seriesCatalog.find((item) => item.key === seriesKey);
    if (!series) return notFound();

    const seasonName = decodeURIComponent(params.season);
    const races = await loadSeriesResults(seriesKey);
    const seasonRaces = races
        .filter((race) => race.seasonName === seasonName)
        .sort((a, b) => {
            const at = a.startTime ? Date.parse(a.startTime) : 0;
            const bt = b.startTime ? Date.parse(b.startTime) : 0;
            return at - bt;
        });

    if (seasonRaces.length === 0) return notFound();

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <Link
                    href="/results"
                    className="inline-flex items-center rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                    ← Back to Results
                </Link>

                <div className="mt-6">
                    <div className="text-xs tracking-widest text-zinc-400">{series.seriesName}</div>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">
                        {seasonName}
                    </h1>
                    <p className="mt-2 text-zinc-300">
                        全部比赛概览（Top 3），点击可进入官方 JSON 详细结果。
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {seasonRaces.map((race) => {
                        const session = race.raceSession;
                        const rows = session?.results?.length
                            ? sortByFinishPosition(session.results)
                            : [];
                        const top3 = rows.slice(0, 3);
                        const track = race.entry.track?.trim() || race.data.track?.track_name || "Unknown Track";
                        const layout = race.entry.layout?.trim() || race.data.track?.config_name || "Layout";
                        const detailHref = `/${seriesKey}/results/${race.entry.id}`;

                        return (
                            <Link
                                key={race.entry.id}
                                href={detailHref}
                                className="block rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition"
                            >
                                <div className="border-b border-white/10 px-6 py-4">
                                    <div className="text-xs tracking-widest text-zinc-400">{race.entry.title}</div>
                                    <div className="mt-2 text-xl font-semibold text-white">
                                        {track} · {layout}
                                    </div>
                                    <div className="mt-2 text-sm text-zinc-300">
                                        {race.startTime ? formatLocal(race.startTime) : "—"}
                                    </div>
                                </div>

                                <div className="bg-white text-zinc-950">
                                    {top3.length === 0 ? (
                                        <div className="px-6 py-6 text-sm text-zinc-600">
                                            No RACE results found in JSON
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-zinc-200">
                                            {top3.map((row) => {
                                                const carLogo = getCarLogo(row.car_name);
                                                const gap = gapDisplay(row);

                                                return (
                                                    <div
                                                        key={`${race.entry.id}-${row.cust_id}-${row.finish_position ?? row.position}`}
                                                        className="px-6 py-4 flex items-center justify-between gap-4"
                                                    >
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="w-8 text-center text-[26px] font-extrabold text-zinc-900">
                                                                {pos1(row)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="truncate text-[18px] font-semibold text-zinc-900">
                                                                    {row.display_name ?? "Driver"}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 flex items-center justify-center">
                                                                {carLogo ? (
                                                                    <img
                                                                        src={carLogo.src}
                                                                        alt={carLogo.alt}
                                                                        className="h-6 w-auto opacity-95"
                                                                    />
                                                                ) : (
                                                                    <div className="h-6 w-6 rounded-full bg-zinc-200" />
                                                                )}
                                                            </div>
                                                            <div className="text-right font-mono text-[26px] font-extrabold text-zinc-900">
                                                                {gap}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
