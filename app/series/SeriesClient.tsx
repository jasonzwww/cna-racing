"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { scheduleData, seriesMeta } from "@/lib/siteData";

function useCountdown(target: Date | null) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return useMemo(() => {
        if (!target) return null;
        const diff = target.getTime() - now.getTime();
        if (diff <= 0) return "00:00:00";
        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
    }, [now, target]);
}

type SeriesCardProps = {
    series: (typeof seriesMeta)[number];
    upcoming?: (typeof scheduleData)[number];
    scheduleHref: string;
    standingsHref: string;
};

function SeriesCard({ series, upcoming, scheduleHref, standingsHref }: SeriesCardProps) {
    const countdown = useCountdown(upcoming ? new Date(upcoming.start) : null);

    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${series.heroImage}')` }}
            />
            <div className="absolute inset-0 bg-black/65" />
            <div className={`absolute inset-0 bg-gradient-to-br ${series.accent}`} />
            <div className="relative flex h-full flex-col gap-6 p-8">
                <div className="text-xs uppercase tracking-[0.3em] text-zinc-300">Series</div>
                <div>
                    <h2 className="text-3xl font-semibold text-white">{series.name}</h2>
                    <p className="mt-2 text-sm text-zinc-200">{series.description}</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <div className="text-xs tracking-widest text-zinc-300">NEXT RACE</div>
                    {upcoming ? (
                        <>
                            <div className="mt-2 text-lg font-semibold text-white">
                                Round {upcoming.round} · {upcoming.track}
                            </div>
                            <div className="mt-1 text-sm text-zinc-200">
                                {new Date(upcoming.start).toLocaleString()}
                            </div>
                            <div className="mt-3 text-sm font-semibold text-amber-200">
                                Countdown: {countdown}
                            </div>
                        </>
                    ) : (
                        <div className="mt-2 text-sm text-zinc-300">赛季已结束，敬请期待。</div>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={scheduleHref}
                        className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                        查看赛程
                    </Link>
                    <Link
                        href={standingsHref}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                    >
                        查看积分
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function SeriesClient() {
    const nextRaces = useMemo(() => {
        return seriesMeta.map((series) => {
            const upcoming = scheduleData
                .filter((race) => race.seriesKey === series.key)
                .find((race) => new Date(race.start).getTime() > Date.now());
            const scheduleHref =
                series.key === "gt3open" ? "/gt3open/schedule" : "/rookie/schedule";
            const standingsHref =
                series.key === "gt3open" ? "/gt3open/standings" : "/rookie/standings";
            return { series, upcoming, scheduleHref, standingsHref };
        });
    }, []);

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {nextRaces.map(({ series, upcoming, scheduleHref, standingsHref }) => (
                <SeriesCard
                    key={series.key}
                    series={series}
                    upcoming={upcoming}
                    scheduleHref={scheduleHref}
                    standingsHref={standingsHref}
                />
            ))}
        </div>
    );
}
