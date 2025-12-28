"use client";

import { useMemo, useState } from "react";

type DriverStanding = {
    custId: string;
    driver: string;
    team: string;
    points: number;
    starts: number;
    wins: number;
    podiums: number;
};

type SeriesStanding = {
    key: string;
    label: string;
    seriesName: string;
    standings: DriverStanding[];
    href: string;
};

export function StandingsBoard({ standings }: { standings: SeriesStanding[] }) {
    const [active, setActive] = useState(standings[0]?.key ?? "");

    const activeStanding = useMemo(
        () => standings.find((item) => item.key === active) ?? standings[0],
        [active, standings]
    );

    if (!activeStanding) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {standings.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={[
                            "rounded-xl px-4 py-2 text-sm font-semibold transition",
                            active === item.key
                                ? "bg-white text-zinc-950"
                                : "border border-white/15 text-zinc-200 hover:bg-white/10",
                        ].join(" ")}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">
                            {activeStanding.seriesName}
                        </div>
                        <div className="text-lg font-semibold text-zinc-100">Driver Standings</div>
                    </div>
                    <a
                        href={activeStanding.href}
                        className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                        Series Page
                    </a>
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
                            {activeStanding.standings.map((driver, idx) => (
                                <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="px-4 py-3 text-zinc-200 font-semibold">{idx + 1}</td>
                                    <td className="px-4 py-3 text-zinc-200">
                                        <a
                                            href={`/standing/${activeStanding.key}/${encodeURIComponent(driver.custId)}`}
                                            className="hover:text-white"
                                        >
                                            {driver.driver}
                                        </a>
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

                {activeStanding.standings.length === 0 && (
                    <div className="px-6 py-6 text-sm text-zinc-300">
                        暂无结果数据，请先在 public/{activeStanding.key}/results 添加 JSON。
                    </div>
                )}
            </div>
        </div>
    );
}
