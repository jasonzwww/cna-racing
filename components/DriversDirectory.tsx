"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { DriverProfile } from "@/lib/resultsData";

const sortOptions = [
    { value: "points", label: "Total Points" },
    { value: "starts", label: "Starts" },
    { value: "irating", label: "iRating" },
    { value: "name", label: "Name" },
] as const;

type SortKey = (typeof sortOptions)[number]["value"];

type ViewMode = "card" | "list";

export function DriversDirectory({ drivers }: { drivers: DriverProfile[] }) {
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("points");
    const [viewMode, setViewMode] = useState<ViewMode>("card");

    const filtered = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        const base = normalized
            ? drivers.filter((driver) => driver.name.toLowerCase().includes(normalized))
            : drivers;

        const sorted = base.slice().sort((a, b) => {
            switch (sortKey) {
                case "points":
                    return b.totalPoints - a.totalPoints;
                case "starts":
                    return b.starts - a.starts;
                case "irating":
                    return (b.irating ?? 0) - (a.irating ?? 0);
                case "name":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return sorted;
    }, [drivers, query, sortKey]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2">
                    <input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search driver name"
                        className="w-full rounded-xl border border-white/15 bg-zinc-950/60 px-4 py-2 text-sm text-white placeholder:text-zinc-500"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="text-xs text-zinc-400">Sort by</label>
                    <select
                        value={sortKey}
                        onChange={(event) => setSortKey(event.target.value as SortKey)}
                        className="rounded-xl border border-white/15 bg-zinc-950/60 px-3 py-2 text-sm text-white"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ViewToggle
                        active={viewMode === "card"}
                        onClick={() => setViewMode("card")}
                    >
                        Card
                    </ViewToggle>
                    <ViewToggle
                        active={viewMode === "list"}
                        onClick={() => setViewMode("list")}
                    >
                        List
                    </ViewToggle>
                </div>
            </div>

            {viewMode === "card" ? (
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
                            <div className="mt-3 text-xs text-zinc-400">
                                最近参赛: {driver.lastRaceLabel ?? "—"}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-200">
                                <Badge label={`iR: ${driver.irating ?? "—"}`} />
                                <Badge label={`SR: ${driver.safetyRating ?? "—"}`} />
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
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Total Points</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Starts</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">iRating</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Safety</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">Last Race</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((driver) => (
                                    <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-zinc-200">
                                            <Link
                                                href={`/drivers/${encodeURIComponent(driver.custId)}`}
                                                className="hover:text-white"
                                            >
                                                {driver.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">
                                            {driver.totalPoints}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.starts}</td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.irating ?? "—"}</td>
                                        <td className="px-4 py-3 text-zinc-200">
                                            {driver.safetyRating ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200">
                                            {driver.lastRaceLabel ?? "—"}
                                        </td>
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

function ViewToggle({
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

function Badge({ label }: { label: string }) {
    return <span className="rounded-full border border-white/15 px-3 py-1">{label}</span>;
}
