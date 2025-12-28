import { buildDriverProfiles, loadSeriesResults } from "@/lib/resultsData";
import { seriesCatalog } from "@/lib/series";
import { DriversClient } from "@/app/drivers/DriversClient";

export default async function DriversPage() {
    const allRaces = (
        await Promise.all(seriesCatalog.map((series) => loadSeriesResults(series.key)))
    ).flat();

    const drivers = buildDriverProfiles(allRaces).map((driver) => ({
        custId: driver.custId,
        name: driver.name,
        starts: driver.starts,
        totalPoints: driver.totalPoints,
        seriesKeys: Array.from(driver.seriesKeys),
        lastRaceLabel: driver.lastRaceLabel,
        irating: driver.irating,
        safetyRating: driver.safetyRating,
    }));

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
                    <DriversClient drivers={drivers} />
                </div>
            </section>
        </main>
    );
}
