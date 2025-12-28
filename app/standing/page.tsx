import { seriesCatalog } from "@/lib/series";
import { computeDriverStandings, loadSeriesResults } from "@/lib/resultsData";
import { StandingsBoard } from "@/components/StandingsBoard";

export default async function StandingPage() {
    const standingsBySeries = await Promise.all(
        seriesCatalog.map(async (series) => {
            const races = await loadSeriesResults(series.key);
            const standings = computeDriverStandings(races);
            return { series, standings };
        })
    );

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <div>
                    <div className="text-xs tracking-widest text-zinc-400">CNA STANDINGS</div>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">积分总榜</h1>
                    <p className="mt-2 text-zinc-300">
                        所有车手数据直接读取比赛结果 JSON，点击车手可查看详细赛季数据。
                    </p>
                </div>

                <div className="mt-10">
                    <StandingsBoard bundles={standingsBySeries} />
                </div>
            </section>
        </main>
    );
}
