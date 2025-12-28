"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DriverProfile } from "@/lib/resultsData";

type SortKey = "name" | "points" | "starts" | "irating";

export function DriversDirectory({ profiles }: { profiles: DriverProfile[] }) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("points");
    const [ascending, setAscending] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        const base = keyword
            ? profiles.filter((profile) => profile.name.toLowerCase().includes(keyword))
            : profiles;

        const sorted = base.slice().sort((a, b) => {
            const direction = ascending ? 1 : -1;
            switch (sortKey) {
                case "name":
                    return a.name.localeCompare(b.name) * direction;
                case "starts":
                    return (a.starts - b.starts) * direction;
                case "irating":
                    return ((a.irating ?? 0) - (b.irating ?? 0)) * direction;
                case "points":
                default:
                    return (a.totalPoints - b.totalPoints) * direction;
            }
        });

        return sorted;
    }, [profiles, search, sortKey, ascending]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
                    <span className="text-sm text-zinc-400">Search</span>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="输入车手名字"
                        className="flex-1 bg-transparent text-sm text-zinc-100 outline-none"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={sortKey}
                        onChange={(event) => setSortKey(event.target.value as SortKey)}
                        className="rounded-xl border border-white/15 bg-zinc-950 px-3 py-2 text-xs font-semibold text-white"
                    >
                        <option value="points">Total Points</option>
                        <option value="name">Name</option>
                        <option value="starts">Starts</option>
                        <option value="irating">iRating</option>
                    </select>
                    <button
                        onClick={() => setAscending((prev) => !prev)}
                        className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                    >
                        {ascending ? "Asc" : "Desc"}
                    </button>
                    <button
                        onClick={() => setViewMode((prev) => (prev === "grid" ? "list" : "grid"))}
                        className="rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10"
                    >
                        {viewMode === "grid" ? "List" : "Grid"}
                    </button>
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((driver) => (
                        <DriverCard key={driver.custId} profile={driver} />
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
                                        <td className="px-4 py-3 text-zinc-200">{driver.lastRaceLabel ?? "—"}</td>
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

function DriverCard({ profile }: { profile: DriverProfile }) {
    return (
        <Link
            href={`/drivers/${encodeURIComponent(profile.custId)}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
        >
            <div className="text-lg font-semibold text-white">{profile.name}</div>
            <div className="mt-2 text-sm text-zinc-300">
                总积分: {profile.totalPoints} · 参赛次数: {profile.starts}
            </div>
            <div className="mt-3 text-xs text-zinc-400">最近参赛: {profile.lastRaceLabel ?? "—"}</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-200">
                <span className="rounded-full border border-white/15 px-3 py-1">iR: {profile.irating ?? "—"}</span>
                <span className="rounded-full border border-white/15 px-3 py-1">SR: {profile.safetyRating ?? "—"}</span>
            </div>
        </Link>
    );
}
