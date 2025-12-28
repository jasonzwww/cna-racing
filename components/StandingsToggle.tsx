"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SeriesDefinition } from "@/lib/series";
import type { DriverStanding } from "@/lib/resultsData";

export function StandingsToggle({
    seriesList,
    standingsBySeries,
}: {
    seriesList: SeriesDefinition[];
    standingsBySeries: Record<string, DriverStanding[]>;
}) {
    const [activeKey, setActiveKey] = useState(seriesList[0]?.key ?? "");

    const activeSeries = useMemo(
        () => seriesList.find((series) => series.key === activeKey) ?? seriesList[0],
        [activeKey, seriesList]
    );

    if (!activeSeries) return null;

    const standings = standingsBySeries[activeSeries.key] ?? [];

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                {seriesList.map((series) => (
                    <button
                        key={series.key}
                        onClick={() => setActiveKey(series.key)}
                        className={[
                            "rounded-xl px-4 py-2 text-sm font-semibold transition",
                            activeSeries.key === series.key
                                ? "bg-white text-zinc-950"
                                : "border border-white/15 text-zinc-200 hover:bg-white/10",
                        ].join(" ")}
                    >
                        {series.label}
                    </button>
                ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">{activeSeries.seriesName}</div>
                        <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                    </div>
                    <Link
                        href={activeSeries.href}
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
                                            href={`/standing/${activeSeries.key}/${encodeURIComponent(driver.custId)}`}
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
                        暂无结果数据，请先在 public/{activeSeries.key}/results 添加 JSON。
                    </div>
                )}
            </div>
        </div>
    );
}
