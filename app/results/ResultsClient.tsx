"use client";

import { useMemo, useState } from "react";
import { resultsData } from "@/lib/siteData";

export function ResultsClient() {
    const [selectedSeason, setSelectedSeason] = useState(resultsData.currentSeason.id);
    const [expandedRound, setExpandedRound] = useState<string | null>(null);

    const season = useMemo(() => {
        if (selectedSeason === resultsData.currentSeason.id) {
            return resultsData.currentSeason;
        }
        return resultsData.pastSeasons.find((s) => s.id === selectedSeason) ?? resultsData.currentSeason;
    }, [selectedSeason]);

    return (
        <div className="grid gap-8">
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="text-xs tracking-[0.3em] text-zinc-400">CURRENT SEASON</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{resultsData.currentSeason.label}</div>
                    <div className="mt-2 text-sm text-zinc-300">
                        Leader: <span className="text-white font-semibold">{resultsData.currentSeason.leader}</span>
                    </div>
                    <button
                        onClick={() => setSelectedSeason(resultsData.currentSeason.id)}
                        className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950"
                    >
                        查看赛季结果
                    </button>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="text-xs tracking-[0.3em] text-zinc-400">PAST SEASONS</div>
                    <div className="mt-4 grid gap-3">
                        {resultsData.pastSeasons.map((past) => (
                            <button
                                key={past.id}
                                onClick={() => setSelectedSeason(past.id)}
                                className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4 text-left transition hover:bg-white/10"
                            >
                                <div className="text-base font-semibold text-white">{past.label}</div>
                                <div className="mt-1 text-sm text-zinc-300">
                                    Winner: <span className="text-white font-semibold">{past.winner}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xs tracking-[0.3em] text-zinc-400">SEASON DETAIL</div>
                        <div className="mt-2 text-2xl font-semibold text-white">{season.label}</div>
                    </div>
                    {"leader" in season && (
                        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">
                            Leader: <span className="text-white font-semibold">{season.leader}</span>
                        </div>
                    )}
                </div>

                <div className="mt-6 grid gap-4">
                    {season.rounds.map((round) => (
                        <div key={round.id} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold text-white">{round.name}</div>
                                    <div className="mt-1 text-xs text-zinc-400">Overview: P1 / P2 / P3</div>
                                </div>
                                <button
                                    onClick={() =>
                                        setExpandedRound((prev) => (prev === round.id ? null : round.id))
                                    }
                                    className="rounded-lg border border-white/10 px-3 py-1 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                                >
                                    {expandedRound === round.id ? "收起详情" : "查看详情"}
                                </button>
                            </div>
                            <div className="mt-3 grid gap-2 text-sm text-zinc-200">
                                {round.top.map((entry) => (
                                    <div
                                        key={entry.position}
                                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                                    >
                                        <div className="text-white font-semibold">P{entry.position} · {entry.driver}</div>
                                        <div className="text-xs text-zinc-400">{entry.car}</div>
                                        <div className="text-xs text-amber-200">{entry.interval}</div>
                                    </div>
                                ))}
                            </div>

                            {expandedRound === round.id && (
                                <div className="mt-4">
                                    <div className="text-xs tracking-widest text-zinc-400">
                                        官方 .json 全量结果
                                    </div>
                                    <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-white/5 text-xs uppercase text-zinc-400">
                                                <tr>
                                                    <th className="px-3 py-2">Pos</th>
                                                    <th className="px-3 py-2">Driver</th>
                                                    <th className="px-3 py-2">Car</th>
                                                    <th className="px-3 py-2">Interval</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-zinc-200">
                                                {round.full.map((entry) => (
                                                    <tr key={`${round.id}-${entry.position}`}>
                                                        <td className="px-3 py-2">P{entry.position}</td>
                                                        <td className="px-3 py-2">{entry.driver}</td>
                                                        <td className="px-3 py-2 text-xs text-zinc-400">{entry.car}</td>
                                                        <td className="px-3 py-2 text-xs text-amber-200">{entry.interval}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
