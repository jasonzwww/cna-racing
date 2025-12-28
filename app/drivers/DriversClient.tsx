"use client";

import { useMemo, useState, type ReactNode } from "react";

export type DriverCard = {
    custId: string;
    name: string;
    starts: number;
    totalPoints: number;
    seriesKeys: string[];
    lastRaceLabel?: string;
    irating?: number;
    safetyRating?: number;
};

type SortKey = "name" | "points" | "starts" | "irating";

type ViewMode = "grid" | "list";

export function DriversClient({ drivers }: { drivers: DriverCard[] }) {
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("points");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase();
        const list = search
            ? drivers.filter((driver) => driver.name.toLowerCase().includes(search))
            : drivers.slice();

        return list.sort((a, b) => {
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
            <div className="flex flex-wrap items-center gap-3">
                <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索车手"
                    className="w-full md:w-72 rounded-xl border border-white/15 bg-zinc-950/60 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500"
                />

                <div className="flex items-center gap-2">
                    <span className="text-xs tracking-widest text-zinc-400">SORT</span>
                    <SelectButton active={sortKey === "points"} onClick={() => setSortKey("points")}>
                        Points
                    </SelectButton>
                    <SelectButton active={sortKey === "name"} onClick={() => setSortKey("name")}>
                        Name
                    </SelectButton>
                    <SelectButton active={sortKey === "starts"} onClick={() => setSortKey("starts")}>
                        Starts
                    </SelectButton>
                    <SelectButton active={sortKey === "irating"} onClick={() => setSortKey("irating")}>
                        iRating
                    </SelectButton>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs tracking-widest text-zinc-400">VIEW</span>
                    <SelectButton active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                        Grid
                    </SelectButton>
                    <SelectButton active={viewMode === "list"} onClick={() => setViewMode("list")}>
                        List
                    </SelectButton>
                </div>
            </div>

            {viewMode === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((driver) => (
                        <DriverCard key={driver.custId} driver={driver} />
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
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">iR</th>
                                    <th className="px-4 py-3 text-left font-semibold text-zinc-200">SR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((driver) => (
                                    <tr key={driver.custId} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 text-zinc-200">
                                            <a
                                                href={`/drivers/${encodeURIComponent(driver.custId)}`}
                                                className="hover:text-white"
                                            >
                                                {driver.name}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200 font-semibold">
                                            {driver.totalPoints}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-200">{driver.starts}</td>
                                        <td className="px-4 py-3 text-zinc-200">
                                            {driver.seriesKeys.join(" / ")}
                                        </td>
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

function DriverCard({ driver }: { driver: DriverCard }) {
    return (
        <a
            href={`/drivers/${encodeURIComponent(driver.custId)}`}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
        >
            <div className="text-lg font-semibold text-white">{driver.name}</div>
            <div className="mt-2 text-sm text-zinc-300">
                CNA 积分: {driver.totalPoints} · 参赛次数: {driver.starts}
            </div>
            <div className="mt-2 text-xs text-zinc-400">
                系列: {driver.seriesKeys.join(" / ")}
            </div>
            <div className="mt-3 text-xs text-zinc-400">最近参赛: {driver.lastRaceLabel ?? "—"}</div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-200">
                <span className="rounded-full border border-white/15 px-3 py-1">
                    iR: {driver.irating ?? "—"}
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1">
                    SR: {driver.safetyRating ?? "—"}
                </span>
            </div>
        </a>
    );
}

function SelectButton({
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
                "rounded-xl px-3 py-1.5 text-xs font-semibold transition",
                active
                    ? "bg-white text-zinc-950"
                    : "border border-white/15 text-zinc-200 hover:bg-white/10",
            ].join(" ")}
        >
            {children}
        </button>
    );
}
