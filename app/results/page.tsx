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

    const activeSeasons = seriesResults.flatMap(({ series, seasons, order }) => {
        const seasonOrder = order.length === 0 ? Array.from(seasons.keys()) : order;
        const seasonName = seasonOrder[0];
        if (!seasonName) return [];

        const races = seasons.get(seasonName) ?? [];
        const cover = races
            .slice()
            .sort((a, b) => {
                const at = a.startTime ? Date.parse(a.startTime) : 0;
                const bt = b.startTime ? Date.parse(b.startTime) : 0;
                return bt - at;
            })
            .find((race) => race.entry.cover)?.entry.cover;
        const standings = computeDriverStandings(races);
        const leader = standings[0]?.driver ?? "—";
        const secondary = standings[1]?.driver ?? "—";

        return [
            {
                series,
                seasonName,
                leader,
                secondary,
                count: races.length,
                cover: cover ?? series.heroImage,
            },
        ];
    });

    const historicalSeasons = seriesResults.flatMap(({ series, seasons, order }) => {
        const seasonOrder = order.length === 0 ? Array.from(seasons.keys()) : order;
        return seasonOrder.slice(1).map((seasonName, idx) => {
            const races = seasons.get(seasonName) ?? [];
            const standings = computeDriverStandings(races);
            const leader = standings[0]?.driver ?? "—";
            const cover = races
                .slice()
                .sort((a, b) => {
                    const at = a.startTime ? Date.parse(a.startTime) : 0;
                    const bt = b.startTime ? Date.parse(b.startTime) : 0;
                    return bt - at;
                })
                .find((race) => race.entry.cover)?.entry.cover;

            return {
                series,
                seasonName,
                leader,
                count: races.length,
                label: idx === 0 ? "Winner" : "Archived",
                cover: cover ?? series.heroImage,
            };
        });
    });

    return (
        <main className="min-h-screen bg-[#070b1a] text-white">
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-wide italic uppercase">
                        Archives
                    </h1>
                    <p className="mt-3 text-sm md:text-base text-zinc-400">
                        Manage current progress and revisit historical glory.
                    </p>
                </div>

                <div className="mt-12">
                    <div className="flex items-center gap-3 text-lg font-semibold uppercase tracking-wide">
                        <span className="text-red-500">⚡</span>
                        <span>Active Seasons</span>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {activeSeasons.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-sm text-zinc-400">
                                暂无进行中的赛季结果。
                            </div>
                        ) : (
                            activeSeasons.map((card) => (
                                <Link
                                    key={`${card.series.key}-${card.seasonName}`}
                                    href={`/results/${card.series.key}/${encodeURIComponent(card.seasonName)}`}
                                    className="group relative overflow-hidden rounded-3xl border border-red-500/40 bg-white/5 p-8 shadow-[0_0_30px_rgba(220,38,38,0.15)] transition hover:border-red-500/70"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-10 transition group-hover:opacity-25"
                                        style={{ backgroundImage: `url('${card.cover}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b132a]/90 via-[#0b132a]/80 to-transparent" />
                                    <div className="relative space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/90 text-xl">
                                                ⏱️
                                            </div>
                                            <div className="rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                                                Live
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-sm uppercase tracking-[0.25em] text-zinc-400">
                                                {card.series.seriesName}
                                            </div>
                                            <div className="mt-2 text-2xl font-semibold italic">
                                                {card.seasonName}
                                            </div>
                                            <div className="mt-2 text-xs uppercase tracking-widest text-zinc-400">
                                                Ongoing
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-white/10 bg-[#0c142b]/80 px-5 py-4">
                                            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                                                Current Leaders
                                            </div>
                                            <div className="mt-3 space-y-2 text-sm font-semibold">
                                                <div className="flex items-center justify-between text-zinc-100">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-red-500">⚡</span>
                                                        {card.leader}
                                                    </span>
                                                    <span className="text-xs text-zinc-400">P1</span>
                                                </div>
                                                <div className="flex items-center justify-between text-zinc-200">
                                                    <span className="flex items-center gap-2">
                                                        <span className="text-red-500">⚡</span>
                                                        {card.secondary}
                                                    </span>
                                                    <span className="text-xs text-zinc-400">P2</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400">
                                            Track Progress <span className="text-base">›</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="mt-16">
                    <div className="flex items-center gap-3 text-lg font-semibold uppercase tracking-wide">
                        <span className="text-zinc-500">↺</span>
                        <span>Historical Records</span>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        {historicalSeasons.length === 0 ? (
                            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-sm text-zinc-400">
                                暂无已归档赛季。
                            </div>
                        ) : (
                            historicalSeasons.map((card) => (
                                <Link
                                    key={`${card.series.key}-${card.seasonName}`}
                                    href={`/results/${card.series.key}/${encodeURIComponent(card.seasonName)}`}
                                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20"
                                >
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-10 transition group-hover:opacity-20"
                                        style={{ backgroundImage: `url('${card.cover}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0b132a]/90 via-[#0b132a]/70 to-transparent" />
                                    <div className="relative">
                                        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-zinc-400">
                                            <span>{card.label}</span>
                                            <span>{card.series.seriesName}</span>
                                        </div>
                                        <div className="mt-4 text-2xl font-semibold italic">
                                            {card.seasonName}
                                        </div>
                                        <div className="mt-2 text-sm text-zinc-300">{card.leader}</div>
                                        <div className="mt-4 text-xs uppercase tracking-widest text-zinc-500">
                                            Races {card.count}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
