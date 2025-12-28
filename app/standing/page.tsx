import Link from "next/link";
import { seriesCatalog } from "@/lib/series";
import { computeDriverStandings, loadSeriesResults } from "@/lib/resultsData";

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

                <div className="mt-10 space-y-10">
                    {standingsBySeries.map(({ series, standings }) => (
                        <div key={series.key} className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                                <div>
                                    <div className="text-xs tracking-widest text-zinc-400">{series.seriesName}</div>
                                    <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                                </div>
                                <Link
                                    href={series.href}
                                    className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                                >
                                    Series Page
                                </Link>
                            </div>

                            <div className="overflow-auto">
                                <table className="min-w-[900px] w-full text-sm">
                                    <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pos</th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Driver</th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Team</th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Pts</th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Starts</th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Wins</th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-200">Podiums</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {standings.map((driver, idx) => (
                                            <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                                <td className="px-4 py-3 text-zinc-200">
                                                    <Link
                                                        href={`/standing/${series.key}/${encodeURIComponent(driver.custId)}`}
                                                        className="hover:text-white"
                                                    >
                                                        {driver.driver}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 text-zinc-200">{driver.team}</td>
                                                <td className="px-4 py-3 text-zinc-200 font-semibold">{driver.points}</td>
                                                <td className="px-4 py-3 text-zinc-200">{driver.starts}</td>
                                                <td className="px-4 py-3 text-zinc-200">{driver.wins}</td>
                                                <td className="px-4 py-3 text-zinc-200">{driver.podiums}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {standings.length === 0 && (
                                <div className="px-6 py-6 text-sm text-zinc-300">
                                    暂无结果数据，请先在 public/{series.key}/results 添加 JSON。
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
