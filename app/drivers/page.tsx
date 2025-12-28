import { buildDriverProfiles, loadSeriesResults } from "@/lib/resultsData";
import { seriesCatalog } from "@/lib/series";
import { DriversDirectory } from "@/components/DriversDirectory";

export default async function DriversPage() {
    const allRaces = (
        await Promise.all(seriesCatalog.map((series) => loadSeriesResults(series.key)))
    ).flat();

    const drivers = buildDriverProfiles(allRaces)
        .map((driver) => ({
            custId: driver.custId,
            name: driver.name,
            series: Array.from(driver.seriesKeys),
            starts: driver.starts,
            totalPoints: driver.totalPoints,
            irating: driver.irating,
            safetyRating: driver.safetyRating,
            lastRaceLabel: driver.lastRaceLabel,
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <div>
                    <div className="text-xs tracking-widest text-zinc-400">CNA DRIVERS</div>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">车手名录</h1>
                    <p className="mt-2 text-zinc-300">
                        所有参与过 CNA 比赛的车手都来自官方结果 JSON，点击查看完整参赛记录。
                    </p>
                </div>

                <div className="mt-8">
                    <DriversDirectory drivers={drivers} />
                </div>
            </section>
        </main>
    );
}
