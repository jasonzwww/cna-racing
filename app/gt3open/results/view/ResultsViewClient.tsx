"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import LocalTime from "@/components/LocalTime";

/** --- CSV parsing helpers --- */
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
    const idx = lines.findIndex((l) => l.toLowerCase().startsWith("start time,"));
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

export default function ResultsViewClient() {
    const sp = useSearchParams();
    const dataParam = sp.get("data"); // base64 encoded csv text
    const name = sp.get("name") ?? "result.csv";

    const decoded = useMemo(() => {
        if (!dataParam) return "";
        try {
            const text = decodeURIComponent(escape(atob(dataParam)));
            return text;
        } catch {
            return "";
        }
    }, [dataParam]);

    const parsed = useMemo(() => {
        if (!decoded) return null;

        const lines = decoded.split(/\r?\n/).map((l) => l.trimEnd());
        const meta = findKeyValueHeader(lines) ?? {};
        const table = findResultsTable(lines);

        if (!table) return { meta, table: null, sortedRows: [] as Record<string, string>[] };

        const finPosCol =
            pickColumn(table.headers, ["fin pos", "finpos", "pos", "position"]) ?? table.headers[0];

        const sortedRows = table.rows.slice().sort((a, b) => {
            const av = safeNum(a[finPosCol] ?? "") ?? 1e9;
            const bv = safeNum(b[finPosCol] ?? "") ?? 1e9;
            return av - bv;
        });

        return { meta, table, sortedRows };
    }, [decoded]);

    if (!dataParam || !decoded) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-lg font-semibold">No data</div>
                <p className="mt-2 text-zinc-300">
                    这个详情页需要从 Results 卡片页点击进入（会自动携带 CSV 数据）。
                </p>
                <Link
                    href="/gt3open/results"
                    className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                >
                    Back to Results
                </Link>
            </div>
        );
    }

    const meta = parsed?.meta ?? {};
    const table = parsed?.table ?? null;
    const rows = parsed?.sortedRows ?? [];

    const track = meta["Track"] ?? "Unknown";
    const startTime = meta["Start Time"] ?? meta["Start time"];
    const series = meta["Series"] ?? "GT3 Open";
    const session = meta["Hosted Session Name"] ?? meta["Session"] ?? "";

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="text-xs tracking-widest text-zinc-400">{series}</div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">{track} — Full Results</h1>
                    <div className="mt-2 text-sm text-zinc-300">
                        {startTime ? <LocalTime iso={startTime} showTzName /> : "Time unknown"}
                        {session ? ` · ${session}` : ""}
                        <span className="text-zinc-500"> · </span>
                        <span className="text-zinc-400">File:</span>{" "}
                        <span className="font-semibold text-zinc-100">{name}</span>
                    </div>
                </div>

                <Link
                    href="/gt3open/results"
                    className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                >
                    ← Back
                </Link>
            </div>

            {/* Meta cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-4">
                <MetaCard label="Track" value={meta["Track"] ?? "-"} />
                <MetaCard label="Start Time" value={meta["Start Time"] ?? "-"} />
                <MetaCard label="Series" value={meta["Series"] ?? "-"} />
                <MetaCard label="Session" value={meta["Hosted Session Name"] ?? "-"} />
            </div>

            {/* Results table */}
            {!table ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                    没找到 Results 表格区块（找不到 “Fin Pos” 标题行）。
                </div>
            ) : (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                        <div className="text-lg font-semibold text-zinc-100">Results</div>
                        <div className="text-sm text-zinc-400">Rows: {rows.length}</div>
                    </div>

                    <div className="overflow-auto">
                        <table className="min-w-[1000px] w-full text-sm">
                            <thead className="sticky top-0 bg-zinc-950/95 backdrop-blur border-b border-white/10">
                            <tr>
                                {table.headers.map((h) => (
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
                            {rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                                    {table.headers.map((h) => (
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
                        这是从 CSV 自动解析的完整结果表。后续我们可以加：Class 分组、车队聚合、积分计算。
                    </div>
                </div>
            )}
        </div>
    );
}

function MetaCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-xs tracking-widest text-zinc-400">{label}</div>
            <div className="mt-2 text-sm font-semibold text-zinc-100 break-words">{value}</div>
        </div>
    );
}
