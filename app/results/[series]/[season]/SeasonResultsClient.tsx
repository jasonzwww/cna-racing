"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type CarLogo = {
    src: string;
    alt: string;
};

type StandingRow = {
    custId: string;
    driver: string;
    team: string;
    points: number;
    starts: number;
    wins: number;
    podiums: number;
};

type RacePreview = {
    id: string | number;
    title: string;
    track: string;
    layout: string;
    startTime?: string;
    href: string;
    top3: Array<{
        position: number | null;
        driver: string;
        gap: string;
        carLogo?: CarLogo | null;
    }>;
};

type SeasonResultsClientProps = {
    seriesName: string;
    seasonName: string;
    standings: StandingRow[];
    races: RacePreview[];
};

const tabStyles = {
    base: "px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
    active: "rounded-full bg-red-600 text-white shadow-lg shadow-red-500/30",
    inactive: "rounded-full text-zinc-400 hover:text-white",
};

export default function SeasonResultsClient({
    seriesName,
    seasonName,
    standings,
    races,
}: SeasonResultsClientProps) {
    const [tab, setTab] = useState<"standings" | "events">("standings");

    const topStandings = useMemo(() => standings.slice(0, 12), [standings]);

    return (
        <div className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-red-500">
                        {seriesName}
                    </div>
                    <h2 className="mt-2 text-3xl md:text-4xl font-semibold italic">
                        {seasonName}
                    </h2>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                        type="button"
                        onClick={() => setTab("standings")}
                        className={`${tabStyles.base} ${
                            tab === "standings" ? tabStyles.active : tabStyles.inactive
                        }`}
                    >
                        Standings
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("events")}
                        className={`${tabStyles.base} ${
                            tab === "events" ? tabStyles.active : tabStyles.inactive
                        }`}
                    >
                        Race Events
                    </button>
                </div>
            </div>

            {tab === "standings" ? (
                <div className="rounded-[32px] border border-red-500/30 bg-[#0b132a]/90 p-6 shadow-[0_0_35px_rgba(220,38,38,0.15)]">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-lg font-semibold uppercase">
                                <span className="text-red-500">🏆</span>
                                <span>Overall Standings</span>
                            </div>

                            <div className="space-y-3">
                                {topStandings.length === 0 ? (
                                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-zinc-400">
                                        No standings yet.
                                    </div>
                                ) : (
                                    topStandings.map((driver, idx) => (
                                        <div
                                            key={`${driver.custId}-${driver.driver}`}
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                                                        idx === 0
                                                            ? "bg-amber-400 text-black"
                                                            : idx === 1
                                                              ? "bg-slate-200 text-black"
                                                              : idx === 2
                                                                ? "bg-orange-600 text-white"
                                                                : "bg-zinc-800 text-white"
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-white">
                                                        {driver.driver}
                                                    </div>
                                                    <div className="text-xs uppercase tracking-widest text-zinc-400">
                                                        {driver.team}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-white">
                                                    {driver.points}
                                                </div>
                                                <div className="text-xs uppercase tracking-widest text-zinc-400">
                                                    PTS
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                Season Overview
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-zinc-200">
                                <div className="rounded-xl border border-white/10 bg-[#0f1833]/80 p-4">
                                    <div className="text-xs uppercase tracking-widest text-zinc-400">
                                        Starts
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {standings.reduce((sum, row) => sum + row.starts, 0)}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-[#0f1833]/80 p-4">
                                    <div className="text-xs uppercase tracking-widest text-zinc-400">
                                        Winners
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {standings.filter((row) => row.wins > 0).length}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-[#0f1833]/80 p-4">
                                    <div className="text-xs uppercase tracking-widest text-zinc-400">
                                        Podiums
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {standings.reduce((sum, row) => sum + row.podiums, 0)}
                                    </div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-[#0f1833]/80 p-4">
                                    <div className="text-xs uppercase tracking-widest text-zinc-400">
                                        Drivers
                                    </div>
                                    <div className="mt-2 text-2xl font-semibold text-white">
                                        {standings.length}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-xs text-zinc-400">
                                Click Race Events to explore full historical results.
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {races.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-sm text-zinc-400">
                            No race events found in this season.
                        </div>
                    ) : (
                        races.map((race) => (
                            <Link
                                key={race.id}
                                href={race.href}
                                className="group block rounded-[32px] border border-white/10 bg-[#0b132a]/90 p-6 transition hover:border-red-500/40"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-red-400">
                                            {seriesName} · ID: {race.id}
                                        </div>
                                        <div className="mt-2 text-2xl font-semibold italic">
                                            {race.track}
                                        </div>
                                        <div className="mt-1 text-sm text-zinc-400">
                                            {race.layout}
                                        </div>
                                    </div>
                                    <div className="text-xs uppercase tracking-widest text-zinc-500">
                                        {race.startTime ?? "—"}
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-4 md:grid-cols-3">
                                    {race.top3.length === 0 ? (
                                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-zinc-400">
                                            No race results found.
                                        </div>
                                    ) : (
                                        race.top3.map((entry) => (
                                            <div
                                                key={`${race.id}-${entry.driver}-${entry.position}`}
                                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#131c38] text-sm font-bold text-white">
                                                        {entry.position ?? "—"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate text-sm font-semibold text-white">
                                                            {entry.driver}
                                                        </div>
                                                        <div className="text-xs text-zinc-400">{entry.gap}</div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                                                    <span>Leader</span>
                                                    {entry.carLogo ? (
                                                        <img
                                                            src={entry.carLogo.src}
                                                            alt={entry.carLogo.alt}
                                                            className="h-5 w-auto opacity-80"
                                                        />
                                                    ) : (
                                                        <span className="h-5 w-5 rounded-full bg-white/10" />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mt-4 text-xs uppercase tracking-widest text-red-400">
                                    Click for full telemetry →
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
