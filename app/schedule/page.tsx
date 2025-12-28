"use client";

import { useMemo, useState } from "react";
import { seriesCatalog } from "@/data/portal";

const registrantsBySeries = {
    gt3open: ["Liang Arrow", "Zhou Nova", "Marcus Yao", "Ken Wu"],
    rookie: ["Chen Rui", "Hannah Lee", "Kaito", "Sora Lin"],
};

type FilterKey = "all" | "gt3open" | "rookie";

export default function SchedulePage() {
    const [filter, setFilter] = useState<FilterKey>("all");
    const now = Date.now();

    const races = useMemo(() => {
        return seriesCatalog
            .flatMap((series) =>
                series.schedule.map((race) => ({
                    ...race,
                    seriesKey: series.key,
                    seriesName: series.shortName,
                    date: new Date(race.start).getTime(),
                }))
            )
            .sort((a, b) => a.date - b.date);
    }, []);

    const filtered = useMemo(() => {
        if (filter === "all") return races;
        return races.filter((race) => race.seriesKey === filter);
    }, [filter, races]);

    const nextRaceId = useMemo(() => {
        return filtered.find((race) => race.date >= now)?.start;
    }, [filtered, now]);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%)]">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="text-xs tracking-[0.4em] text-zinc-400">SCHEDULE</div>
                    <h1 className="mt-4 text-4xl font-semibold text-white">赛程总览</h1>
                    <p className="mt-3 max-w-2xl text-base text-zinc-300">
                        默认展示所有系列赛程，可使用筛选按钮查看单一系列。下一场比赛高亮，已结束的比赛会显示为灰色。
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {[
                            { key: "all", label: "All Series" },
                            { key: "gt3open", label: "GT3 Open" },
                            { key: "rookie", label: "Rookie Cup" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setFilter(item.key as FilterKey)}
                                className={[
                                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                                    filter === item.key
                                        ? "bg-white text-zinc-950"
                                        : "border border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10",
                                ].join(" ")}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-4">
                    {filtered.map((race) => {
                        const isPast = race.date < now;
                        const isNext = race.start === nextRaceId;
                        return (
                            <article
                                key={`${race.seriesKey}-${race.round}`}
                                className={[
                                    "rounded-2xl border border-white/10 p-5 transition",
                                    isNext ? "bg-white/10 ring-1 ring-white/40" : "bg-white/5",
                                    isPast ? "opacity-40" : "opacity-100",
                                ].join(" ")}
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                            {race.seriesName}
                                        </div>
                                        <div className="mt-2 text-lg font-semibold text-white">
                                            Round {race.round} · {race.track}
                                        </div>
                                        <div className="mt-1 text-sm text-zinc-300">
                                            {new Date(race.start).toLocaleString()}
                                        </div>
                                        {race.format && (
                                            <div className="mt-1 text-xs text-zinc-400">{race.format}</div>
                                        )}
                                    </div>

                                    <details className="group rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm">
                                        <summary className="cursor-pointer list-none font-semibold text-white">
                                            Register / View
                                        </summary>
                                        <div className="mt-3 border-t border-white/10 pt-3 text-zinc-300">
                                            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                                Registered Drivers
                                            </div>
                                            <ul className="mt-2 grid gap-1 text-sm">
                                                {registrantsBySeries[race.seriesKey].map((name) => (
                                                    <li key={`${race.seriesKey}-${name}`}>{name}</li>
                                                ))}
                                            </ul>
                                            <button className="mt-3 w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-950">
                                                Register for this race
                                            </button>
                                        </div>
                                    </details>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
