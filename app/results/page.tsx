"use client";

import { useState } from "react";
import { resultsSeasons } from "@/data/portal";

export default function ResultsPage() {
    const [activeSeason, setActiveSeason] = useState<string | null>(
        resultsSeasons[0] ? `${resultsSeasons[0].series}-${resultsSeasons[0].season}` : null
    );
    const [activeRound, setActiveRound] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%)]">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="text-xs tracking-[0.4em] text-zinc-400">RESULTS</div>
                    <h1 className="mt-4 text-4xl font-semibold text-white">赛季结果</h1>
                    <p className="mt-3 max-w-2xl text-base text-zinc-300">
                        当前赛季展示 Leader，历史赛季展示 Winner。点击赛季可查看每站比赛概览，再点开查看官方 JSON 结果明细。
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-6">
                    {resultsSeasons.map((season) => {
                        const isActive = activeSeason === `${season.series}-${season.season}`;
                        return (
                            <div
                                key={`${season.series}-${season.season}`}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                            {season.series}
                                        </div>
                                        <h2 className="mt-2 text-2xl font-semibold text-white">Season {season.season}</h2>
                                        <div className="mt-1 text-sm text-zinc-300">{season.highlight}</div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const seasonKey = `${season.series}-${season.season}`;
                                            setActiveSeason(isActive ? null : seasonKey);
                                            setActiveRound(null);
                                        }}
                                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
                                    >
                                        {isActive ? "Collapse" : "View Overview"}
                                    </button>
                                </div>

                                {isActive && (
                                    <div className="mt-6 space-y-4">
                                        {season.rounds.map((round) => {
                                            const roundKey = `${season.series}-${season.season}-r${round.round}`;
                                            const isRoundActive = activeRound === roundKey;
                                            return (
                                                <div
                                                    key={roundKey}
                                                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                                                >
                                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                                        <div>
                                                            <div className="text-sm font-semibold text-white">
                                                                Round {round.round} · {round.track}
                                                            </div>
                                                            <div className="mt-1 text-xs text-zinc-400">
                                                                P1 {round.overview.p1} · P2 {round.overview.p2} · P3 {round.overview.p3}
                                                            </div>
                                                            <div className="text-xs text-zinc-500">
                                                                {round.overview.car} · Interval {round.overview.interval}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                setActiveRound(isRoundActive ? null : roundKey)
                                                            }
                                                            className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                                                        >
                                                            {isRoundActive ? "Hide Detail" : "View Detail"}
                                                        </button>
                                                    </div>

                                                    {isRoundActive && (
                                                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                                                            <table className="w-full text-left text-sm">
                                                                <thead className="bg-white/10 text-xs uppercase tracking-[0.25em] text-zinc-400">
                                                                    <tr>
                                                                        <th className="px-4 py-2">Pos</th>
                                                                        <th className="px-4 py-2">Driver</th>
                                                                        <th className="px-4 py-2">Car</th>
                                                                        <th className="px-4 py-2">Interval</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {round.detail.map((entry) => (
                                                                        <tr key={`${roundKey}-${entry.position}`} className="border-t border-white/10">
                                                                            <td className="px-4 py-2 text-white">{entry.position}</td>
                                                                            <td className="px-4 py-2 text-zinc-200">{entry.driver}</td>
                                                                            <td className="px-4 py-2 text-zinc-300">{entry.car}</td>
                                                                            <td className="px-4 py-2 text-zinc-400">{entry.interval}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
