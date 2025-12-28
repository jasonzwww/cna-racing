import Link from "next/link";
import { buildDriverProfiles, loadSeriesResults } from "@/lib/resultsData";
import { seriesCatalog } from "@/lib/series";

export default async function DriversPage() {
    const allRaces = (
        await Promise.all(seriesCatalog.map((series) => loadSeriesResults(series.key)))
    ).flat();

    const drivers = buildDriverProfiles(allRaces).sort((a, b) => a.name.localeCompare(b.name));

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

                <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {drivers.map((driver) => (
                        <Link
                            key={driver.custId}
                            href={`/drivers/${encodeURIComponent(driver.custId)}`}
                            className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
                        >
                            <div className="text-lg font-semibold text-white">{driver.name}</div>
                            <div className="mt-2 text-sm text-zinc-300">
                                参赛次数: {driver.starts} · 系列: {Array.from(driver.seriesKeys).join(" / ")}
                            </div>
                            <div className="mt-3 text-xs text-zinc-400">
                                最近参赛: {driver.lastRaceLabel ?? "—"}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-200">
                                <span className="rounded-full border border-white/15 px-3 py-1">
                                    iR: {driver.irating ?? "—"}
                                </span>
                                <span className="rounded-full border border-white/15 px-3 py-1">
                                    SR: {driver.safetyRating ?? "—"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
