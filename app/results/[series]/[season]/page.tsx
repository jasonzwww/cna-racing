import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarLogo } from "@/lib/carLogos";
import { gapDisplay } from "@/lib/raceFormatting";
import { formatLocal, pos1, sortByFinishPosition } from "@/lib/iracingResult";
import { seriesCatalog, type SeriesKey } from "@/lib/series";
import { computeDriverStandings, loadSeriesResults } from "@/lib/resultsData";
import SeasonResultsClient from "./SeasonResultsClient";

function parseSeriesKey(key: string): SeriesKey | null {
    return (seriesCatalog.find((series) => series.key === key)?.key ?? null) as SeriesKey | null;
}

export default async function SeasonResultsPage({
    params,
}: {
    params: Promise<{ series: string; season: string }>;
}) {
    const { series: seriesParam, season } = await params;
    const seriesKey = parseSeriesKey(seriesParam);
    if (!seriesKey) return notFound();

    const seriesDefinition = seriesCatalog.find((item) => item.key === seriesKey);
    if (!seriesDefinition) return notFound();

    const seasonName = decodeURIComponent(season);
    const races = await loadSeriesResults(seriesKey);
    const seasonRaces = races
        .filter((race) => race.seasonName === seasonName)
        .sort((a, b) => {
            const at = a.startTime ? Date.parse(a.startTime) : 0;
            const bt = b.startTime ? Date.parse(b.startTime) : 0;
            return at - bt;
        });

    if (seasonRaces.length === 0) return notFound();

    const standings = computeDriverStandings(seasonRaces);
    const raceCards = seasonRaces.map((race) => {
        const session = race.raceSession;
        const rows = session?.results?.length ? sortByFinishPosition(session.results) : [];
        const top3 = rows.slice(0, 3).map((row) => ({
            position: pos1(row),
            driver: row.display_name ?? "Driver",
            gap: gapDisplay(row),
            carLogo: getCarLogo(row.car_name),
        }));
        const track = race.entry.track?.trim() || race.data.track?.track_name || "Unknown Track";
        const layout = race.entry.layout?.trim() || race.data.track?.config_name || "Layout";

        return {
            id: race.entry.id,
            title: race.entry.title,
            track,
            layout,
            startTime: race.startTime ? formatLocal(race.startTime) : "—",
            href: `/${seriesKey}/results/${race.entry.id}`,
            top3,
        };
    });

    return (
        <main className="min-h-screen bg-[#070b1a] text-white">
            <section className="mx-auto max-w-6xl px-6 py-14">
                <Link
                    href="/results"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-white"
                >
                    ← Back to Seasons
                </Link>

                <SeasonResultsClient
                    seriesName={seriesDefinition.seriesName}
                    seasonName={seasonName}
                    standings={standings}
                    races={raceCards}
                />
            </section>
        </main>
    );
}
