"use client";

import React, { useMemo, useState } from "react";

type ResultCard = {
    id: string;        // localStorage key
    fileName: string;
    startTime?: string;
    track?: string;
    series?: string;
    session?: string;
    layout?: string;
    top3: { pos: number; name: string; time?: string; car?: string }[];
};

const LS_PREFIX = "cna:gt3:result:";

function lsKey(id: string) {
    return `${LS_PREFIX}${id}`;
}

function saveCsvToLocalStorage(id: string, payload: any) {
    localStorage.setItem(lsKey(id), JSON.stringify(payload));
}

function parseCsvLine(line: string): string[] {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') {
                cur += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }
        if (ch === "," && !inQuotes) {
            out.push(cur);
            cur = "";
            continue;
        }
        cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
}

function findKeyValueHeader(lines: string[]) {
    const idx = lines.findIndex((l) =>
        l.toLowerCase().startsWith("start time,")
    );
    if (idx < 0 || idx + 1 >= lines.length) return null;

    const keys = parseCsvLine(lines[idx]);
    const vals = parseCsvLine(lines[idx + 1]);
    const obj: Record<string, string> = {};
    keys.forEach((k, i) => (obj[k] = vals[i] ?? ""));
    return obj;
}

function findResultsTable(lines: string[]) {
    const idx = lines.findIndex((l) => l.toLowerCase().includes("fin pos"));
    if (idx < 0) return null;

    const headers = parseCsvLine(lines[idx]);
    const rows: Record<string, string>[] = [];

    for (let i = idx + 1; i < lines.length; i++) {
        const raw = lines[i].trim();
        if (!raw) break;
        const cols = parseCsvLine(raw);

        const obj: Record<string, string> = {};
        headers.forEach((h, j) => (obj[h] = cols[j] ?? ""));
        rows.push(obj);
    }

    return { headers, rows };
}

function normalizeHeader(h: string) {
    return h.replace(/^"+|"+$/g, "").trim();
}

function pickColumn(headers: string[], candidates: string[]) {
    const norm = headers.map((h) => normalizeHeader(h).toLowerCase());
    const idx = norm.findIndex((h) => candidates.includes(h));
    return idx >= 0 ? headers[idx] : null;
}

function safeNum(s: string) {
    const n = Number(String(s).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : null;
}

function slugify(s: string) {
    return s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function formatLocal(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function isPastByStart(startTime?: string) {
    if (!startTime) return false;
    const t = Date.parse(startTime);
    if (!Number.isFinite(t)) return false;
    return Date.now() > t;
}

export function Gt3ResultsCards() {
    const [cards, setCards] = useState<ResultCard[]>([]);
    const [error, setError] = useState<string>("");
    const [trackFilter, setTrackFilter] = useState<string>("ALL");

    const tracks = useMemo(() => {
        const set = new Set<string>();
        for (const c of cards) if (c.track) set.add(c.track);
        return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
    }, [cards]);

    const filtered = useMemo(() => {
        const list =
            trackFilter === "ALL"
                ? cards
                : cards.filter((c) => (c.track ?? "Unknown") === trackFilter);

        // sort newest first
        return list.slice().sort((a, b) => {
            const ta = a.startTime ? Date.parse(a.startTime) : -Infinity;
            const tb = b.startTime ? Date.parse(b.startTime) : -Infinity;
            return tb - ta;
        });
    }, [cards, trackFilter]);

    async function handleFiles(files: FileList | null) {
        setError("");
        if (!files || files.length === 0) return;

        const next: ResultCard[] = [];

        for (const f of Array.from(files)) {
            try {
                const text = await f.text();
                const lines = text.split(/\r?\n/).map((l) => l.trimEnd());

                const meta = findKeyValueHeader(lines) ?? {};
                const table = findResultsTable(lines);

                const startTime = meta["Start Time"] || meta["Start time"];
                const track = meta["Track"] || "Unknown";
                const series = meta["Series"] || "";
                const session = meta["Hosted Session Name"] || meta["Session"] || "";
                const layout =
                    meta["Configuration"] ||
                    meta["Track Config"] ||
                    meta["Layout"] ||
                    "Layout";

                // build top3
                let top3: ResultCard["top3"] = [];

                if (table) {
                    const finPosCol =
                        pickColumn(table.headers, ["fin pos", "finpos", "pos", "position"]) ??
                        table.headers[0];

                    const nameCol =
                        pickColumn(table.headers, ["driver", "display name", "name"]) ??
                        pickColumn(table.headers, ["cust name", "customer name"]) ??
                        null;

                    const timeCol =
                        pickColumn(table.headers, ["time", "interval", "finish time", "gap"]) ??
                        null;

                    const carCol = pickColumn(table.headers, ["car"]) ?? null;

                    const rowsSorted = table.rows
                        .slice()
                        .sort((a, b) => {
                            const av = safeNum(a[finPosCol] ?? "") ?? 1e9;
                            const bv = safeNum(b[finPosCol] ?? "") ?? 1e9;
                            return av - bv;
                        });

                    top3 = rowsSorted.slice(0, 3).map((r, i) => ({
                        pos: i + 1,
                        name: nameCol ? (r[nameCol] ?? "Driver") : "Driver",
                        time: timeCol ? (r[timeCol] ?? "") : "",
                        car: carCol ? (r[carCol] ?? "") : "",
                    }));
                }

                // ✅ Save to localStorage
                const id = crypto.randomUUID();
                saveCsvToLocalStorage(id, {
                    fileName: f.name,
                    csvText: text,
                    uploadedAt: Date.now(),
                });

                next.push({
                    id,
                    fileName: f.name,
                    startTime,
                    track,
                    series,
                    session,
                    layout,
                    top3,
                });
            } catch (e) {
                setError("有文件读取/解析失败。请确认是 iRacing 导出的 CSV。");
            }
        }

        setCards((prev) => [...prev, ...next]);
    }

    function clearAll() {
        // only clears UI list; doesn't wipe storage (safer)
        setCards([]);
        setTrackFilter("ALL");
        setError("");
    }

    function purgeStorage() {
        // wipe all stored results
        const keys: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith(LS_PREFIX)) keys.push(k);
        }
        keys.forEach((k) => localStorage.removeItem(k));
        clearAll();
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Top bar */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">
                            CNA GT3 OPEN
                        </div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Results 结果
                        </h1>
                        <p className="mt-2 text-zinc-300">
                            上传多个 iRacing CSV：自动识别每场比赛并生成卡片（Top 3 / Track / Layout）。
                            点击卡片进入详情页（localStorage，不怕 URL 超长）。
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Filter */}
                        <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <span className="text-xs font-semibold text-zinc-200">
                Filter Track
              </span>
                            <select
                                value={trackFilter}
                                onChange={(e) => setTrackFilter(e.target.value)}
                                className="bg-transparent text-sm text-zinc-100 outline-none"
                            >
                                {tracks.map((t) => (
                                    <option key={t} value={t} className="bg-zinc-900">
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Upload */}
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-lime-300 px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90">
                            Upload CSV(s)
                            <input
                                type="file"
                                accept=".csv,text/csv"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </label>

                        <button
                            onClick={clearAll}
                            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                        >
                            Clear UI
                        </button>

                        <button
                            onClick={purgeStorage}
                            className="inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-500/20"
                            title="Remove all stored CSV results from this browser"
                        >
                            Purge Storage
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                        {error}
                    </div>
                )}

                {/* Cards grid */}
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((c) => (
                        <ResultTrackCard key={c.id} card={c} />
                    ))}
                </div>

                {cards.length === 0 && (
                    <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-zinc-300">
                        还没有数据。点击{" "}
                        <span className="font-semibold text-zinc-100">Upload CSV(s)</span>{" "}
                        上传比赛结果 CSV。
                    </div>
                )}
            </div>
        </main>
    );
}

function ResultTrackCard({ card }: { card: ResultCard }) {
    const trackName = card.track ?? "Unknown";
    const slug = slugify(trackName);

    // Optional track cover images:
    // public/tracks/watkins-glen.jpg
    const coverUrl = `/tracks/${slug}.jpg`;

    const finished = isPastByStart(card.startTime);

    // ✅ localStorage id link
    const viewHref = `/gt3open/results/view?id=${encodeURIComponent(card.id)}`;

    return (
        <a
            href={viewHref}
            className={[
                "block rounded-3xl overflow-hidden border border-white/10 bg-white/5 transition",
                "hover:bg-white/10",
                finished ? "opacity-50" : "opacity-100",
            ].join(" ")}
        >
            {/* Cover */}
            <div className="relative h-48 bg-zinc-900">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${coverUrl}')` }}
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-lime-300" />

                <div className="relative p-6">
                    <div className="text-xs tracking-widest text-zinc-300">
                        {card.series ? card.series : "GT3 OPEN"}
                    </div>

                    <div className="mt-2 text-3xl font-extrabold tracking-tight text-white">
                        {trackName.toUpperCase()}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-200">
                        <span className="opacity-90">🏁 {card.layout ?? "Layout"}</span>
                        {card.startTime && (
                            <span className="opacity-90">🕒 {formatLocal(card.startTime)}</span>
                        )}
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                        Open full results →
                    </div>
                </div>
            </div>

            {/* Top 3 */}
            <div className="bg-white text-zinc-950">
                <div className="divide-y divide-zinc-200">
                    {card.top3.length === 0 ? (
                        <div className="px-6 py-5 text-sm text-zinc-600">
                            未识别到 Results 表（请确认 CSV 含有 “Fin Pos” 区块）
                            <div className="mt-2 text-xs text-zinc-500">File: {card.fileName}</div>
                        </div>
                    ) : (
                        card.top3.map((r) => (
                            <div
                                key={r.pos}
                                className="px-6 py-4 flex items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-6 text-center font-extrabold">{r.pos}</div>
                                    <div className="font-semibold">{r.name}</div>
                                </div>
                                <div className="font-mono font-bold">{r.time || "—"}</div>
                            </div>
                        ))
                    )}
                </div>

                <div className="px-6 py-4 text-xs text-zinc-500 flex items-center justify-between">
                    <span>{finished ? "Finished" : "Latest upload"}</span>
                    <span className="truncate max-w-[60%]">{card.fileName}</span>
                </div>
            </div>
        </a>
    );
}
