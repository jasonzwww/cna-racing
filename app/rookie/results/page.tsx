import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import {
    unwrapIRacingEvent,
    getSession,
    sortByFinishPosition,
    pos1,
    msToClock,
    formatLocal,
} from "@/lib/iracingResult";

type IndexEntry = {
    id: string | number;
    title: string;
    date?: string;
    track?: string; // 优先用 index 的
    layout?: string;
    file: string; // "/rookie/results/81610301.json"
    cover?: string; // "/rookie/covers/navarra.png"
};

async function readJsonFromPublic<T>(publicPath: string): Promise<T> {
    const full = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    const raw = await fs.readFile(full, "utf-8");
    return JSON.parse(raw) as T;
}

function normalizeCarName(name?: string) {
    return (name ?? "").toLowerCase().trim();
}

// 车标：放到 public/cars/*.png （你 GT3 已经用过这套）
// 你也可以改成 /rookie/cars/xxx.png
const CAR_LOGO_MAP: { key: string; src: string; alt: string }[] = [
    { key: "mazda", src: "/cars/mazda.png", alt: "Mazda" },
    { key: "mx-5", src: "/cars/mazda.png", alt: "Mazda" },
];

function getCarLogo(carName?: string) {
    const n = normalizeCarName(carName);
    const hit = CAR_LOGO_MAP.find((m) => n.includes(m.key));
    return hit ?? null;
}

/** iRacing JSON interval 常见是 tick=1/10000秒（0.1ms） */
function timeAnyToMs(v: unknown): number | null {
    if (typeof v !== "number") return null;
    if (!Number.isFinite(v) || v <= 0) return v === 0 ? 0 : null;

    // heuristic:
    // - 如果很小（< 100000），很多时候是 “秒”
    // - 否则按 tick(1/10000s) 处理
    if (v < 100000) return Math.round(v * 1000);
    return Math.round(v / 10); // tick -> ms
}

function gapToLeaderDisplay(row: any) {
    const raw = row?.class_interval ?? row?.interval;
    const ms = timeAnyToMs(raw);
    if (ms === null) return "—";
    if (ms === 0) return "WIN";
    return `+${msToClock(ms)}`;
}

function isPast(start?: string) {
    if (!start) return false;
    const t = Date.parse(start);
    if (!Number.isFinite(t)) return false;
    return t < Date.now();
}

export default async function RookieResultsListPage() {
    const index = await readJsonFromPublic<IndexEntry[]>("/rookie/results/index.json");

    const cards = await Promise.all(
        index.map(async (e) => {
            const id = String(e.id).trim();

            const json = await readJsonFromPublic<any>(e.file);
            const data = unwrapIRacingEvent(json);

            const series = data?.series_name ?? "CNA 新手赛";
            const start = data?.start_time;
            const finished = isPast(start);

            const trackName = e.track?.trim() || data?.track?.track_name || "Unknown Track";
            const layout = e.layout?.trim() || data?.track?.config_name || "Layout";

            const race = data ? getSession(data, "RACE") : null;
            const sorted = race ? sortByFinishPosition(race.results ?? []) : [];
            const top3 = sorted.slice(0, 3);

            return { entry: e, id, series, start, finished, trackName, layout, top3 };
        })
    );

    // start_time 新->旧
    cards.sort((a, b) => {
        const ta = a.start ? Date.parse(a.start) : -Infinity;
        const tb = b.start ? Date.parse(b.start) : -Infinity;
        return tb - ta;
    });

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA ROOKIE</div>
                        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                            Results <span className="opacity-90">结果</span>
                        </h1>

                    </div>

                    <Link
                        href="/rookie"
                        className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back to Rookie
                    </Link>
                </div>

                <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {cards.map((c) => {
                        const href = `/rookie/results/${c.id}`;

                        return (
                            <Link
                                key={c.id}
                                href={href}
                                className={[
                                    "block overflow-hidden rounded-[28px] border border-white/10 bg-white/5",
                                    "shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition hover:bg-white/10",
                                    c.finished ? "ring-1 ring-white/5" : "",
                                ].join(" ")}
                            >
                                {/* Top image */}
                                <div className="relative h-56">
                                    {c.entry.cover ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url('${c.entry.cover}')` }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-800" />
                                    )}

                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.10)_45%,rgba(0,0,0,0.12))]" />

                                    <div className="absolute left-6 top-6 text-[11px] tracking-widest text-white/70">
                                        Hosted iRacing
                                    </div>
                                </div>

                                {/* Middle info */}
                                <div className="relative bg-[#121214] px-6 py-5">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-red-500" />

                                    <div
                                        className="text-[30px] md:text-[34px] font-extrabold tracking-tight text-white leading-[1.05]"
                                        style={{ textShadow: "0 10px 30px rgba(0,0,0,0.55)" }}
                                    >
                                        {(c.trackName ?? "UNKNOWN").replaceAll("-", " ").toUpperCase()}
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px] text-white/80">
                    <span className="inline-flex items-center gap-2">
                      <span>🏁</span>
                      <span>{c.layout}</span>
                    </span>
                                        <span className="inline-flex items-center gap-2">
                      <span>🕒</span>
                      <span>{formatLocal(c.start)}</span>
                    </span>
                                    </div>

                                    <div className="mt-4 inline-flex items-center rounded-full bg-white/12 px-4 py-2 text-[11px] font-semibold text-white hover:bg-white/18">
                                        Open full results →
                                    </div>
                                </div>

                                {/* Bottom Top3 */}
                                <div className="bg-white text-zinc-950">
                                    <div className="divide-y divide-zinc-200">
                                        {c.top3.length === 0 ? (
                                            <div className="px-6 py-6 text-sm text-zinc-600">
                                                No RACE results found
                                                <div className="mt-2 text-xs text-zinc-500">ID: {c.id}</div>
                                            </div>
                                        ) : (
                                            c.top3.map((r: any) => {
                                                const carLogo = getCarLogo(r.car_name);
                                                const gap = gapToLeaderDisplay(r);

                                                return (
                                                    <div
                                                        key={`${c.id}-${r.cust_id}-${r.finish_position ?? r.position}`}
                                                        className="px-6 py-4 flex items-center justify-between gap-4"
                                                    >
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="w-8 text-center text-[26px] font-extrabold text-zinc-900">
                                                                {pos1(r)}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="truncate text-[18px] font-semibold text-zinc-900">
                                                                    {r.display_name ?? "Driver"}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 flex items-center justify-center">
                                                                {carLogo ? (
                                                                    <img
                                                                        src={carLogo.src}
                                                                        alt={carLogo.alt}
                                                                        className="h-6 w-auto opacity-95"
                                                                    />
                                                                ) : (
                                                                    <div className="h-6 w-6 rounded-full bg-zinc-200" />
                                                                )}
                                                            </div>

                                                            <div className="text-right font-mono text-[26px] font-extrabold text-zinc-900">
                                                                {gap}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="px-6 py-3 text-[12px] text-zinc-600 flex items-center justify-between">
                                        <span className="font-medium">{c.finished ? "Finished" : "Upcoming/Running"}</span>
                                        <span className="truncate max-w-[60%]">{c.entry.title}</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {cards.length === 0 && (
                    <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-zinc-300">
                        index.json 里还没有任何比赛条目。
                    </div>
                )}
            </div>
        </main>
    );
}
