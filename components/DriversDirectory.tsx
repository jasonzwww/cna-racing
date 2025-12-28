"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";

export type DriverDirectoryEntry = {
    custId: string;
    name: string;
    series: string[];
    starts: number;
    totalPoints: number;
    irating?: number;
    safetyRating?: number;
    lastRaceLabel?: string;
};

type SortKey = "points" | "starts" | "name" | "irating";

type ViewMode = "grid" | "list";

export function DriversDirectory({ drivers }: { drivers: DriverDirectoryEntry[] }) {
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("points");
    const [view, setView] = useState<ViewMode>("grid");

    const filtered = useMemo(() => {
        const lowered = query.trim().toLowerCase();
        const base = lowered
            ? drivers.filter((driver) => driver.name.toLowerCase().includes(lowered))
            : drivers;

        return base.slice().sort((a, b) => {
            switch (sortKey) {
                case "name":
                    return a.name.localeCompare(b.name);
                case "starts":
                    return b.starts - a.starts;
                case "irating":
                    return (b.irating ?? 0) - (a.irating ?? 0);
                case "points":
                default:
                    return b.totalPoints - a.totalPoints;
            }
        });
    }, [drivers, query, sortKey]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="flex-1">
                        <span className="sr-only">Search drivers</span>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search driver"
                            className="w-full rounded-2xl border border-white/15 bg-zinc-950/60 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
                        />
                    </label>
                    <select
                        value={sortKey}
                        onChange={(event) => setSortKey(event.target.value as SortKey)}
                        className="rounded-2xl border border-white/15 bg-zinc-950/60 px-4 py-2 text-sm text-white"
                    >
                        <option value="points">Sort by Points</option>
                        <option value="starts">Sort by Starts</option>
                        <option value="name">Sort by Name</option>
                        <option value="irating">Sort by iRating</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <ToggleButton active={view === "grid"} onClick={() => setView("grid")}>Grid</ToggleButton>
                    <ToggleButton active={view === "list"} onClick={() => setView("list")}>List</ToggleButton>
                </div>
            </div>

            {view === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((driver) => (
                        <Link
                            key={driver.custId}
                            href={`/drivers/${encodeURIComponent(driver.custId)}`}
                            className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
                        >
                            <div className="text-lg font-semibold text-white">{driver.name}</div>
                            <div className="mt-2 text-sm text-zinc-300">
                                参赛次数: {driver.starts} · 总积分: {driver.totalPoints}
                            </div>
                            <div className="mt-2 text-xs text-zinc-400">
                                系列: {driver.series.join(" / ")}
                            </div>
                            <div className="mt-3 text-xs text-zinc-400">
                                最近参赛: {driver.lastRaceLabel ?? "—"}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-200">
                                <span className="rounded-full border border-white/15 px-3 py-1">
                                    iR: {driver.irating ?? "—"}
                                </span>
                                <span className="rounded-full border border-white/15 px-3 py-1">
                                    SR: {driver.safetyRating ?? "—"}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="overflow-auto">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Driver</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Points</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Starts</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Series</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">iRating</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">SR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((driver) => (
                                    <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">
                                            <Link
                                                href={`/drivers/${encodeURIComponent(driver.custId)}`}
                                                className="hover:text-white"
                                            >
                                                {driver.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.totalPoints}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.starts}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.series.join(" / ")}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.irating ?? "—"}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.safetyRating ?? "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

function ToggleButton({
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
