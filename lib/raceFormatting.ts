import { msToClock } from "@/lib/iracingResult";

function iracingTickToMs(ticks: number) {
    return Math.round(ticks / 10);
}

export function gapDisplay(row: any) {
    if (!row) return "—";

    const classInterval = typeof row.class_interval === "number" ? row.class_interval : null;
    const interval = typeof row.interval === "number" ? row.interval : null;
    const ticks = classInterval ?? interval;

    if (ticks === null) return "—";
    if (ticks === -1) return "—";
    if (ticks === 0) return "WIN";

    const ms = iracingTickToMs(ticks);
    return `+${msToClock(ms)}`;
}
