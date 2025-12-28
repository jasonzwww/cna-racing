"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownProps = {
    schedule: { round: number; track: string; start: string }[];
};

function formatRemaining(ms: number) {
    if (ms <= 0) return "Starts soon";
    const totalMinutes = Math.floor(ms / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d ${hours}h ${minutes}m`;
}

export function SeriesCountdown({ schedule }: CountdownProps) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 60000);
        return () => window.clearInterval(id);
    }, []);

    const nextRace = useMemo(() => {
        return schedule
            .map((race) => ({ ...race, time: new Date(race.start).getTime() }))
            .filter((race) => !Number.isNaN(race.time) && race.time >= now)
            .sort((a, b) => a.time - b.time)[0];
    }, [schedule, now]);

    if (!nextRace) {
        return <div className="text-sm text-zinc-400">No upcoming races.</div>;
    }

    const timeLeft = nextRace.time - now;

    return (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-300">
                Next Race Countdown
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
                {formatRemaining(timeLeft)}
            </div>
            <div className="mt-2 text-sm text-zinc-300">
                Round {nextRace.round} · {nextRace.track}
            </div>
            <div className="text-xs text-zinc-500">{new Date(nextRace.start).toLocaleString()}</div>
        </div>
    );
}
