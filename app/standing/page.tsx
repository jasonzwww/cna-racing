"use client";

import { useState } from "react";
import { seriesCatalog, standingsData } from "@/data/portal";

export default function StandingPage() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%)]">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="text-xs tracking-[0.4em] text-zinc-400">STANDINGS</div>
                    <h1 className="mt-4 text-4xl font-semibold text-white">积分总榜</h1>
                    <p className="mt-3 max-w-2xl text-base text-zinc-300">
                        查看各系列赛积分榜，点击车手可展开个人数据明细。
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-8">
                    {seriesCatalog.map((series) => (
                        <div key={series.key} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                        {series.shortName}
                                    </div>
                                    <h2 className="mt-2 text-2xl font-semibold text-white">{series.name}</h2>
                                </div>
                                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-300">
                                    Season 26S1
                                </span>
                            </div>

                            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-white/10 text-xs uppercase tracking-[0.25em] text-zinc-400">
                                        <tr>
                                            <th className="px-4 py-3">Driver</th>
                                            <th className="px-4 py-3">Team</th>
                                            <th className="px-4 py-3">Pts</th>
                                            <th className="px-4 py-3">Wins</th>
                                            <th className="px-4 py-3">Podiums</th>
                                            <th className="px-4 py-3">Gap</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {standingsData[series.key].map((driver) => (
                                            <tr
                                                key={`${series.key}-${driver.name}`}
                                                className="border-t border-white/10 hover:bg-white/5"
                                            >
                                                <td className="px-4 py-3">
                                                    <button
                                                        className="text-left font-semibold text-white"
                                                        onClick={() =>
                                                            setSelected(
                                                                selected === `${series.key}-${driver.name}`
                                                                    ? null
                                                                    : `${series.key}-${driver.name}`
                                                            )
                                                        }
                                                    >
                                                        {driver.name}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 text-zinc-300">{driver.team}</td>
                                                <td className="px-4 py-3 text-white">{driver.points}</td>
                                                <td className="px-4 py-3 text-zinc-300">{driver.wins}</td>
                                                <td className="px-4 py-3 text-zinc-300">{driver.podiums}</td>
                                                <td className="px-4 py-3 text-zinc-400">{driver.gap}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selected && selected.startsWith(series.key) && (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-300">
                                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">Driver Detail</div>
                                    <div className="mt-2 font-semibold text-white">
                                        {selected.replace(`${series.key}-`, "")}
                                    </div>
                                    <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                            <div className="text-xs text-zinc-400">Starts</div>
                                            <div className="text-lg font-semibold text-white">
                                                {standingsData[series.key].find(
                                                    (driver) => `${series.key}-${driver.name}` === selected
                                                )?.starts ?? 0}
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                            <div className="text-xs text-zinc-400">Podium %</div>
                                            <div className="text-lg font-semibold text-white">58%</div>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                            <div className="text-xs text-zinc-400">Consistency</div>
                                            <div className="text-lg font-semibold text-white">A-</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
