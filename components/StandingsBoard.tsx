"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { SeriesDefinition } from "@/lib/series";
import type { DriverStanding } from "@/lib/resultsData";

export type StandingsBundle = {
    series: SeriesDefinition;
    standings: DriverStanding[];
};

export function StandingsBoard({ bundles }: { bundles: StandingsBundle[] }) {
    const [activeKey, setActiveKey] = useState(bundles[0]?.series.key ?? "gt3open");

    const activeBundle = useMemo(() => {
        return bundles.find((bundle) => bundle.series.key === activeKey) ?? bundles[0];
    }, [bundles, activeKey]);

    if (!activeBundle) {
        return <div className="text-sm text-zinc-400">暂无结果数据</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {bundles.map((bundle) => (
                    <button
                        key={bundle.series.key}
                        onClick={() => setActiveKey(bundle.series.key)}
                        className={[
                            "rounded-xl px-4 py-2 text-sm font-semibold transition",
                            activeKey === bundle.series.key
                                ? "bg-white text-zinc-950"
                                : "border border-white/15 text-zinc-200 hover:bg-white/10",
                        ].join(" ")}
                    >
                        {bundle.series.label}
                    </button>
                ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">
                            {activeBundle.series.seriesName}
                        </div>
                        <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                    </div>
                    <Link
                        href={activeBundle.series.href}
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
                            {activeBundle.standings.map((driver, idx) => (
                                <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                    <td className="px-4 py-3 text-zinc-200">
                                        <Link
                                            href={`/standing/${activeBundle.series.key}/${encodeURIComponent(
                                                driver.custId
                                            )}`}
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

                {activeBundle.standings.length === 0 && (
                    <div className="px-6 py-6 text-sm text-zinc-300">
                        暂无结果数据，请先在 public/{activeBundle.series.key}/results 添加 JSON。
                    </div>
                )}
            </div>
        </div>
    );
}
