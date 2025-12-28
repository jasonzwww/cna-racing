"use client";

import { useMemo, useState, type ReactNode } from "react";
import LocalTime from "@/components/LocalTime";
import { SeriesDefinition, SeriesKey } from "@/lib/series";

export type ScheduleRace = {
    id: string;
    seriesKey: SeriesKey;
    seriesName: string;
    seasonName: string;
    round: number;
    track: string;
    start: string;
    format?: string;
    note?: string;
};

type RegistrationsMap = Record<SeriesKey, Record<number, string[]>>;

export function ScheduleBoard({
    series,
    races,
    registrations,
}: {
    series: SeriesDefinition[];
    races: ScheduleRace[];
    registrations: RegistrationsMap;
}) {
    const [filter, setFilter] = useState<"all" | SeriesKey>("all");
    const now = new Date();

    const filteredRaces = useMemo(() => {
        const base = filter === "all" ? races : races.filter((race) => race.seriesKey === filter);
        return base
            .slice()
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }, [filter, races]);

    const nextBySeries = useMemo(() => {
        return series.map((item) => {
            const upcoming = races
                .filter((race) => race.seriesKey === item.key)
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .find((race) => new Date(race.start).getTime() >= now.getTime());
            return { series: item, race: upcoming ?? null };
        });
    }, [series, races, now]);

    function isPast(start: string) {
        return new Date(start).getTime() < now.getTime();
    }

    return (
        <div className="space-y-10">
            <section className="grid gap-4 md:grid-cols-2">
                {nextBySeries.map(({ series: item, race }) => (
                    <div
                        key={item.key}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                        <div
                            className={`absolute inset-0 opacity-70 bg-gradient-to-br ${item.accent}`}
                        />
                        <div className="relative">
                            <div className="text-xs tracking-widest text-zinc-300">NEXT IN {item.label}</div>
                            {race ? (
                                <>
                                    <div className="mt-2 text-xl font-semibold text-white">
                                        R{race.round} · {race.track}
                                    </div>
                                    <div className="mt-2 text-sm text-zinc-200">
                                        <LocalTime iso={race.start} />
                                        {race.format ? ` · ${race.format}` : ""}
                                    </div>
                                </>
                            ) : (
                                <div className="mt-2 text-sm text-zinc-300">暂无新的赛事安排</div>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            <section className="flex flex-wrap gap-2">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All Series</FilterButton>
                {series.map((item) => (
                    <FilterButton
                        key={item.key}
                        active={filter === item.key}
                        onClick={() => setFilter(item.key)}
                    >
                        {item.label}
                    </FilterButton>
                ))}
            </section>

            <section className="space-y-4">
                {filteredRaces.map((race) => {
                    const past = isPast(race.start);
                    const registrationList = registrations[race.seriesKey]?.[race.round] ?? [];

                    return (
                        <div
                            key={race.id}
                            className={[
                                "rounded-3xl border bg-white/5 p-6 transition",
                                past ? "border-white/10 opacity-45" : "border-white/15 hover:bg-white/10",
                            ].join(" ")}
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="mt-2 h-2 w-2 rounded-full bg-red-500/90" />
                                    <div>
                                        <div className="text-xs tracking-widest text-zinc-400">
                                            {race.seriesName} · ROUND {race.round}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold text-white">{race.track}</div>
                                        <div className="mt-2 text-sm text-zinc-300">
                                            <LocalTime iso={race.start} />
                                            {race.format ? ` · ${race.format}` : ""}
                                            {race.note ? ` · ${race.note}` : ""}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-xl border border-white/15 px-3 py-1.5 text-xs font-semibold text-zinc-100">
                                        {past ? "Finished" : "Upcoming"}
                                    </span>

                                    <details className="group relative">
                                        <summary className="cursor-pointer list-none rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-white/10">
                                            Registration ▾
                                        </summary>
                                        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-xs text-zinc-200 shadow-xl">
                                            <div className="font-semibold text-white">Register</div>
                                            <a
                                                href="https://discord.gg/J3PwH5n2by"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="mt-2 inline-flex rounded-lg bg-white px-3 py-1 text-xs font-semibold text-zinc-950"
                                            >
                                                Join via Discord
                                            </a>
                                            <div className="mt-3 text-[11px] uppercase tracking-widest text-zinc-400">
                                                Registered
                                            </div>
                                            {registrationList.length === 0 ? (
                                                <div className="mt-2 text-zinc-400">暂无报名</div>
                                            ) : (
                                                <ul className="mt-2 space-y-1">
                                                    {registrationList.map((name) => (
                                                        <li key={name}>{name}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}

function FilterButton({
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
