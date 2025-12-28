"use client";

import { useMemo, useState } from "react";
import { registrations, scheduleData } from "@/lib/siteData";

const filters = [
    { id: "all", label: "全部" },
    { id: "gt3open", label: "GT3 Open" },
    { id: "rookie", label: "CNA 新手赛" },
];

type FilterId = (typeof filters)[number]["id"];

export function ScheduleClient() {
    const [activeFilter, setActiveFilter] = useState<FilterId>("all");
    const [openMenu, setOpenMenu] = useState<string | null>(null);

    const races = useMemo(() => {
        if (activeFilter === "all") return scheduleData;
        return scheduleData.filter((race) => race.seriesKey === activeFilter);
    }, [activeFilter]);

    const nextRaceId = useMemo(() => {
        const upcoming = scheduleData.find((race) => new Date(race.start).getTime() > Date.now());
        return upcoming?.id ?? null;
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={[
                            "rounded-full px-4 py-2 text-sm font-semibold transition",
                            activeFilter === filter.id
                                ? "bg-white text-zinc-950"
                                : "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
                        ].join(" ")}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {races.map((race) => {
                    const startDate = new Date(race.start);
                    const isPast = startDate.getTime() < Date.now();
                    const isNext = race.id === nextRaceId;
                    const registrants = registrations[race.seriesKey];
                    return (
                        <div
                            key={race.id}
                            className={[
                                "rounded-2xl border border-white/10 bg-white/5 p-5 transition",
                                isNext ? "ring-1 ring-amber-300/60 bg-amber-500/10" : "",
                                isPast ? "opacity-50 grayscale" : "",
                            ].join(" ")}
                        >
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="text-xs tracking-[0.3em] text-zinc-400">
                                        {race.seriesLabel}
                                    </div>
                                    <div className="mt-2 text-lg font-semibold text-white">
                                        Round {race.round} · {race.track}
                                    </div>
                                    <div className="mt-1 text-sm text-zinc-300">
                                        {startDate.toLocaleString()} · {race.format}
                                    </div>
                                    {race.note && (
                                        <div className="mt-1 text-xs text-amber-200">{race.note}</div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() =>
                                            setOpenMenu((prev) => (prev === race.id ? null : race.id))
                                        }
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
                                    >
                                        报名 / 查看
                                        <span className="text-xs">▾</span>
                                    </button>

                                    {openMenu === race.id && (
                                        <div className="absolute right-0 z-20 mt-2 w-64 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-xl">
                                            <button className="w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm font-semibold text-zinc-100 hover:bg-white/10">
                                                立即报名
                                            </button>
                                            <div className="mt-3 text-xs tracking-widest text-zinc-400">
                                                已报名
                                            </div>
                                            <ul className="mt-2 space-y-1 text-sm text-zinc-200">
                                                {registrants.map((name) => (
                                                    <li key={name} className="flex items-center justify-between">
                                                        <span>{name}</span>
                                                        <span className="text-xs text-zinc-500">已确认</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
