"use client";

import { useEffect, useMemo, useState } from "react";

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function formatLocal(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function RaceCountdown({
                                  targetIso,
                                  title = "RACE STARTS IN",
                                  subtitle,
                              }: {
    targetIso: string;
    title?: string;
    subtitle?: string;
}) {
    const targetMs = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
    const [nowMs, setNowMs] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNowMs(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const diff = targetMs - nowMs;

    const isStarted = diff <= 0;

    const totalSec = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    return (
        <div className="rounded-2xl border border-white/15 bg-white/10 p-6">
            <div className="text-xs tracking-widest text-zinc-300">{title}</div>

            <div className="mt-3 grid grid-cols-4 gap-3">
                <TimeBox label="DAYS" value={String(days)} />
                <TimeBox label="HRS" value={pad2(hours)} />
                <TimeBox label="MIN" value={pad2(minutes)} />
                <TimeBox label="SEC" value={pad2(seconds)} />
            </div>

            <div className="mt-4 text-sm text-zinc-300">
                {isStarted ? (
                    <span className="font-semibold text-white">Race has started</span>
                ) : (
                    <>
                        <span className="text-zinc-200">Start time:</span>{" "}
                        <span className="font-semibold text-white">{formatLocal(targetIso)}</span>
                    </>
                )}
            </div>

            {subtitle && <div className="mt-2 text-sm text-zinc-300">{subtitle}</div>}
        </div>
    );
}

function TimeBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4 text-center">
            <div className="text-2xl font-semibold text-white tabular-nums">
                {value}
            </div>
            <div className="mt-1 text-[11px] tracking-widest text-zinc-400">
                {label}
            </div>
        </div>
    );
}
