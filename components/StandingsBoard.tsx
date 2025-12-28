"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { DriverStanding } from "@/lib/resultsData";
import type { SeriesDefinition, SeriesKey } from "@/lib/series";

type StandingsPayload = {
    series: SeriesDefinition;
    standings: DriverStanding[];
};

export function StandingsBoard({ entries }: { entries: StandingsPayload[] }) {
    const [activeSeries, setActiveSeries] = useState<SeriesKey>(entries[0]?.series.key ?? "gt3open");

    const active = useMemo(
        () => entries.find((entry) => entry.series.key === activeSeries) ?? entries[0],
        [entries, activeSeries]
    );

    if (!active) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
                {entries.map((entry) => (
                    <TabButton
                        key={entry.series.key}
                        active={entry.series.key === activeSeries}
                        onClick={() => setActiveSeries(entry.series.key)}
                    >
                        {entry.series.label}
                    </TabButton>
                ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">{active.series.seriesName}</div>
                        <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                    </div>
                    <Link
                        href={active.series.href}
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
                            {active.standings.map((driver, idx) => (
                                <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                    <td className="px-4 py-3 text-zinc-200">
                                        <Link
                                            href={`/standing/${active.series.key}/${encodeURIComponent(driver.custId)}`}
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

                {active.standings.length === 0 && (
                    <div className="px-6 py-6 text-sm text-zinc-300">
                        暂无结果数据，请先在 public/{active.series.key}/results 添加 JSON。
                    </div>
                )}
            </div>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                active
                    ? "bg-white text-zinc-950"
                    : "border border-white/15 text-zinc-200 hover:bg-white/10",
            ].join(" ")}
        >
            {children}
        </button>
    );
}
