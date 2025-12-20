"use client";

import React, { useMemo, useState } from "react";

type ParsedSection = {
    title: string;
    headers: string[];
    rows: Record<string, string>[];
};

function parseCsvLine(line: string): string[] {
    // Robust CSV line parser supporting quotes + commas
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const ch = line[i];

        if (ch === '"') {
            // handle escaped quotes ""
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

function tryParseKeyValueSection(lines: string[]) {
    // For iRacing export header:
    // Start Time,Track,Series,Hosted Session Name
    // "2025-...Z","Spa...","Hosted iRacing","CNA Racing"
    const idx = lines.findIndex((l) =>
        l.replace(/\s+/g, " ").toLowerCase().startsWith("start time,")
    );
    if (idx < 0 || idx + 1 >= lines.length) return null;

    const keys = parseCsvLine(lines[idx]);
    const vals = parseCsvLine(lines[idx + 1]);
    const obj: Record<string, string> = {};
    keys.forEach((k, i) => (obj[k] = vals[i] ?? ""));
    return obj;
}

function findResultsSection(lines: string[]): ParsedSection | null {
    // Find the results header row that contains "Fin Pos"
    const idx = lines.findIndex((l) =>
        l.toLowerCase().includes("fin pos")
    );
    if (idx < 0) return null;

    const header = parseCsvLine(lines[idx]);

    // collect subsequent non-empty lines as rows until blank line
    const rows: Record<string, string>[] = [];
    for (let i = idx + 1; i < lines.length; i++) {
        const raw = lines[i].trim();
        if (!raw) break;

        const cols = parseCsvLine(raw);

        // If row has fewer cols, pad; if more, truncate
        const padded = header.map((_, j) => cols[j] ?? "");

        const obj: Record<string, string> = {};
        header.forEach((h, j) => (obj[h] = padded[j]));
        rows.push(obj);
    }

    return {
        title: "Results",
        headers: header,
        rows,
    };
}

function toMillis(iso: string): number | null {
    const t = Date.parse(iso);
    return Number.isFinite(t) ? t : null;
}

function normalizeHeader(h: string) {
    return h.replace(/^"+|"+$/g, "").trim();
}

function guessImportantColumns(headers: string[]) {
    const norm = headers.map(normalizeHeader).map((s) => s.toLowerCase());

    const pick = (candidates: string[]) => {
        const i = norm.findIndex((h) => candidates.includes(h));
        return i >= 0 ? headers[i] : null;
    };

    return {
        finPos: pick(["fin pos", "finpos", "pos", "position"]),
        driver: pick(["driver", "display name", "name"]),
        team: pick(["team", "team name"]),
        car: pick(["car"]),
        carClass: pick(["car class"]),
        laps: pick(["laps", "completed laps"]),
        interval: pick(["interval", "time", "gap"]),
        bestLap: pick(["fastest lap time", "best lap time"]),
    };
}

function safeNumber(s: string) {
    const n = Number(String(s).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : null;
}

export function CsvResultsViewer() {
    const [fileName, setFileName] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [error, setError] = useState<string>("");

    const lines = useMemo(() => {
        return text
            .split(/\r?\n/)
            .map((l) => l.trimEnd())
            .filter((l, i, arr) => !(l === "" && (arr[i - 1] === ""))); // compress double empties a bit
    }, [text]);

    const meta = useMemo(() => {
        if (!text) return null;
        return tryParseKeyValueSection(lines);
    }, [text, lines]);

    const resultsSection = useMemo(() => {
        if (!text) return null;
        return findResultsSection(lines);
    }, [text, lines]);

    const important = useMemo(() => {
        return resultsSection ? guessImportantColumns(resultsSection.headers) : null;
    }, [resultsSection]);

    const startMs = useMemo(() => {
        const start = meta?.["Start Time"] || meta?.["Start time"] || meta?.["StartTime"];
        if (!start) return null;
        return toMillis(start);
    }, [meta]);

    const isPast = useMemo(() => {
        if (!startMs) return null;
        return Date.now() >= startMs;
    }, [startMs]);

    const sortedRows = useMemo(() => {
        if (!resultsSection) return [];
        const { finPos } = important ?? {};
        const rows = [...resultsSection.rows];

        if (finPos) {
            rows.sort((a, b) => {
                const av = safeNumber(a[finPos] ?? "") ?? 1e9;
                const bv = safeNumber(b[finPos] ?? "") ?? 1e9;
                return av - bv;
            });
        }
        return rows;
    }, [resultsSection, important]);

    async function onPickFile(f: File | null) {
        setError("");
        setText("");
        setFileName("");

        if (!f) return;
        setFileName(f.name);

        try {
            const content = await f.text();
            setText(content);
        } catch (e) {
            setError("读取文件失败：请确认这是一个可读的 CSV 文件。");
        }
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="text-xs tracking-widest text-zinc-400">GT3 OPEN</div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
                        Results 结果
                    </h1>
                    <p className="mt-2 text-zinc-300">
                        上传 iRacing 导出的 CSV，系统会自动识别并展示比赛结果。
                    </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10">
                    Upload CSV
                    <input
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                    />
                </label>
            </div>

            {fileName && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-300">
                    <span className="text-zinc-400">Loaded:</span>{" "}
                    <span className="font-semibold text-zinc-100">{fileName}</span>
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
                    {error}
                </div>
            )}

            {/* Meta */}
            {meta && (
                <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <MetaCard label="Start Time" value={meta["Start Time"] ?? "-"} />
                    <MetaCard label="Track" value={meta["Track"] ?? "-"} />
                    <MetaCard label="Series" value={meta["Series"] ?? "-"} />
                    <MetaCard label="Session" value={meta["Hosted Session Name"] ?? "-"} />

                    <div className="md:col-span-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-zinc-300">
                                <span className="text-zinc-400">Status:</span>{" "}
                                {isPast === null ? (
                                    <span className="text-zinc-200">Unknown</span>
                                ) : isPast ? (
                                    <span className="font-semibold text-zinc-200">Finished (auto-grey)</span>
                                ) : (
                                    <span className="font-semibold text-zinc-100">Upcoming/Running</span>
                                )}
                            </div>
                            <div className="text-zinc-500">
                                （根据 Start Time 与系统时间判断）
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {!resultsSection && text && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                    没找到 Results 表格区块（找不到 “Fin Pos” 标题行）。请确认这是 iRacing 导出的结果 CSV。
                </div>
            )}

            {resultsSection && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                        <div className="text-lg font-semibold text-zinc-100">
                            Results Table
                        </div>
                        <div className="text-sm text-zinc-400">
                            Rows: {sortedRows.length}
                        </div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-[900px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                            <tr>
                                {resultsSection.headers.map((h) => (
                                    <th
                                        key={h}
                                        className="px-4 py-3 text-left font-semibold text-zinc-200 whitespace-nowrap"
                                    >
                                        {normalizeHeader(h)}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {sortedRows.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className={[
                                        "border-b border-white/5",
                                        isPast ? "opacity-45" : "opacity-100",
                                        "hover:bg-white/5",
                                    ].join(" ")}
                                >
                                    {resultsSection.headers.map((h) => (
                                        <td key={h} className="px-4 py-3 text-zinc-200 whitespace-nowrap">
                                            {row[h] ?? ""}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-5 py-4 text-xs text-zinc-400">
                        如果你的 CSV 有额外字段或格式略不同，这个页面会尽量自动兼容；核心识别点是 “Fin Pos” 那段结果表格。
                    </div>
                </div>
            )}

            {!text && (
                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                    还没有上传 CSV。点击右上角 <span className="font-semibold text-zinc-100">Upload CSV</span> 选择文件即可。
                </div>
            )}
        </div>
    );
}

function MetaCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs tracking-widest text-zinc-400">{label}</div>
            <div className="mt-2 text-sm font-semibold text-zinc-100 break-words">
                {value}
            </div>
        </div>
    );
}
