"use client";

import { useMemo, useState } from "react";
import { pos1, msToClock } from "@/lib/iracingResult";

function toNum(v: any): number | null {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

/**
 * iRacing results 常见时间单位：
 * - interval / class_interval：tick = 1/10000 秒
 * - best_lap_time：很多文件也是 tick（但也可能已经是 ms）
 *
 * 我们用一个「阈值」做兼容：
 * - 如果数值非常大（> 1,000,000），几乎肯定是 tick（例如 2:18.334 ≈ 1,383,340 ticks）
 * - 否则当作 ms（例如 138,334ms）
 */
function maybeTickToMs(x: number) {
    // tick -> ms : ticks / 10
    return x > 1_000_000 ? Math.round(x / 10) : x;
}

/** interval 显示：WIN / +gap / — */
function intervalText(row: any) {
    const ci = toNum(row?.class_interval);
    const iv = toNum(row?.interval);
    const ticks = ci ?? iv;

    if (ticks === null) return "—";
    if (ticks === -1) return "—";
    if (ticks === 0) return "WIN";

    const ms = maybeTickToMs(ticks);
    return `+${msToClock(ms)}`;
}

/** points：自动找字段 */
function pointsText(row: any) {
    const p =
        row?.champ_points ??
        row?.points ??
        row?.agg_points ??
        row?.champ_pts ??
        row?.agg_pts;

    if (p === null || p === undefined || p === "") return "—";
    return String(p);
}

/** best lap：返回 ms（兼容 tick / ms） */
function bestLapMs(row: any): number | null {
    const raw = toNum(row?.best_lap_time);
    if (raw === null) return null;
    if (raw <= 0) return null;

    return maybeTickToMs(raw);
}

function SectionTable({
                          subtitle,
                          rows,
                      }: {
    subtitle: string;
    rows: any[];
}) {
    // 找 session 内最快 best lap
    const fastest = useMemo(() => {
        const vals = rows
            .map(bestLapMs)
            .filter((x): x is number => typeof x === "number");
        if (vals.length === 0) return null;
        return Math.min(...vals);
    }, [rows]);

    return (
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="text-sm text-zinc-400">{subtitle}</div>
                <div className="text-sm text-zinc-400">Rows: {rows.length}</div>
            </div>

            <div className="overflow-auto">
                <table className="min-w-[1000px] w-full text-sm">
                    <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Pos
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Driver
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Car
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Laps
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Inc
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Interval
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Best Lap
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-zinc-200">
                            Points
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows.map((r: any) => {
                        const bl = bestLapMs(r);
                        const isFastest = fastest !== null && bl !== null && bl === fastest;

                        return (
                            <tr
                                key={`${r.cust_id}-${r.finish_position ?? r.position}`}
                                className="border-b border-white/5 hover:bg-white/5"
                            >
                                <td className="px-4 py-3 text-zinc-200 font-semibold">
                                    {pos1(r)}
                                </td>
                                <td className="px-4 py-3 text-zinc-200">
                                    {r.display_name ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-zinc-200">{r.car_name ?? "—"}</td>
                                <td className="px-4 py-3 text-zinc-200">
                                    {r.laps_complete ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-zinc-200">
                                    {r.incidents ?? "—"}
                                </td>

                                {/* ✅ interval tick -> ms */}
                                <td className="px-4 py-3 text-zinc-200 font-mono">
                                    {intervalText(r)}
                                </td>

                                {/* ✅ best lap tick -> ms, fastest purple */}
                                <td
                                    className={[
                                        "px-4 py-3 font-mono",
                                        isFastest ? "text-purple-400 font-extrabold" : "text-zinc-200",
                                    ].join(" ")}
                                >
                                    {bl ? msToClock(bl) : "—"}
                                </td>

                                {/* ✅ points */}
                                <td className="px-4 py-3 text-zinc-200 font-semibold">
                                    {pointsText(r)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {rows.length === 0 && (
                <div className="px-6 py-6 text-zinc-300">
                    No results found in this session.
                </div>
            )}
        </div>
    );
}

export default function ResultsTabs({
                                        qualiTitle,
                                        raceTitle,
                                        qualiSubtitle,
                                        raceSubtitle,
                                        qualiRows,
                                        raceRows,
                                    }: {
    qualiTitle: string;
    raceTitle: string;
    qualiSubtitle: string;
    raceSubtitle: string;
    qualiRows: any[];
    raceRows: any[];
}) {
    const [tab, setTab] = useState<"race" | "quali">(
        raceRows?.length ? "race" : "quali"
    );

    const activeRows = tab === "race" ? raceRows : qualiRows;
    const activeSubtitle = tab === "race" ? raceSubtitle : qualiSubtitle;
    const activeTitle = tab === "race" ? raceTitle : qualiTitle;

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <div className="text-lg font-semibold text-zinc-100">{activeTitle}</div>
                    <div className="text-sm text-zinc-400">{activeSubtitle}</div>
                </div>

                <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1">
                    <button
                        onClick={() => setTab("race")}
                        className={[
                            "px-4 py-2 rounded-xl text-sm font-semibold transition",
                            tab === "race"
                                ? "bg-white text-zinc-950"
                                : "text-zinc-200 hover:bg-white/10",
                        ].join(" ")}
                    >
                        Race
                    </button>
                    <button
                        onClick={() => setTab("quali")}
                        className={[
                            "px-4 py-2 rounded-xl text-sm font-semibold transition",
                            tab === "quali"
                                ? "bg-white text-zinc-950"
                                : "text-zinc-200 hover:bg-white/10",
                        ].join(" ")}
                    >
                        Qualify
                    </button>
                </div>
            </div>

            <SectionTable subtitle={activeSubtitle} rows={activeRows} />
        </div>
    );
}
