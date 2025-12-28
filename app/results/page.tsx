import Link from "next/link";
import { seriesCatalog } from "@/lib/series";
import {
    computeDriverStandings,
    getSeasonOrder,
    groupRacesBySeason,
    loadSeriesResults,
} from "@/lib/resultsData";

export default async function ResultsPage() {
    const seriesResults = await Promise.all(
        seriesCatalog.map(async (series) => {
            const races = await loadSeriesResults(series.key);
            const seasons = groupRacesBySeason(races);
            const order = getSeasonOrder(races);
            return { series, races, seasons, order };
        })
    );

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <div>
                    <div className="text-xs tracking-widest text-zinc-400">CNA RESULTS</div>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">赛季结果</h1>
                    <p className="mt-2 text-zinc-300">
                        当前赛季显示 Leader，过往赛季显示 Winner，点击可查看完整比赛概览与官方数据。
                    </p>
                </div>

                <div className="mt-10 space-y-10">
                    {seriesResults.map(({ series, seasons, order }) => {
                        const seasonOrder = order.length === 0 ? Array.from(seasons.keys()) : order;
                        const seasonCards = seasonOrder.map((seasonName, idx) => {
                            const races = seasons.get(seasonName) ?? [];
                            const standings = computeDriverStandings(races);
                            const leader = standings[0]?.driver ?? "—";
                            const label = idx === 0 ? "Leader" : "Winner";
                            const cover =
                                races.find((race) => race.entry.cover)?.entry.cover ??
                                series.heroImage;

                            return {
                                seasonName,
                                label,
                                leader,
                                count: races.length,
                                cover,
                            };
                        });

                        return (
                            <div key={series.key} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs tracking-widest text-zinc-400">{series.seriesName}</div>
                                        <div className="text-lg font-semibold text-zinc-100">Season Results</div>
                                    </div>
                                    <Link
                                        href={series.href}
                                        className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                                    >
                                        Series Page
                                    </Link>
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    {seasonCards.length === 0 ? (
                                        <div className="text-sm text-zinc-400">暂无结果数据</div>
                                    ) : (
                                        seasonCards.map((card) => (
                                            <Link
                                                key={card.seasonName}
                                                href={`/results/${series.key}/${encodeURIComponent(card.seasonName)}`}
                                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-5 hover:bg-white/10 transition"
                                            >
                                                <div className="absolute inset-0 opacity-25">
                                                    <img
                                                        src={card.cover}
                                                        alt={card.seasonName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <div className="text-xs tracking-widest text-zinc-300">
                                                        {card.label}
                                                    </div>
                                                    <div className="mt-2 text-lg font-semibold text-white">
                                                        {card.seasonName}
                                                    </div>
                                                    <div className="mt-1 text-sm text-zinc-200">{card.leader}</div>
                                                    <div className="mt-3 text-xs text-zinc-400">
                                                        Races: {card.count}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
