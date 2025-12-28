import Link from "next/link";
import { gt3open, GT3Race } from "@/data/gt3open";
import { RaceCountdown } from "@/components/RaceCountdown";

function formatStart(iso: string) {
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

function isPast(r: GT3Race, now: Date) {
    return new Date(r.start).getTime() < now.getTime();
}

export default function GT3OpenOverviewPage() {
    const now = new Date();

    const races = gt3open.races
        .slice()
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const nextRace = races.find((r) => !isPast(r, now)) ?? null;

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* HERO */}
            <section className="relative min-h-[70vh] overflow-hidden border-b border-white/10">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-[position:50%_70%]"
                    style={{ backgroundImage: "url('/lineup.png')" }}
                />

                {/* Dark overlay (不要太黑) */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Broadcast glow */}
                <div className="absolute inset-0 opacity-35 [background:radial-gradient(70%_60%_at_50%_10%,rgba(255,255,255,0.22),transparent_60%)]" />

                {/* Grid texture */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:60px_60px]" />

                {/* CONTENT */}
                <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
                    <div className="grid gap-8 md:grid-cols-12 md:items-start">
                        {/* LEFT */}
                        <div className="md:col-span-7">
                            <div className="inline-flex items-center gap-2 text-xs tracking-widest text-zinc-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                OFFICIAL SERIES PAGE
                            </div>

                            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white">
                                {gt3open.seriesName}
                            </h1>

                            <p className="mt-3 text-lg text-zinc-200">
                                {gt3open.seasonName}
                            </p>

                            <p className="mt-5 max-w-2xl text-zinc-200 leading-relaxed">
                                GT3 多站点系列赛。赛程、积分与规则统一发布，
                                赛程会根据系统时间自动标记已结束赛事。
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/gt3open/schedule"
                                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:opacity-90"
                                >
                                    View Schedule
                                </Link>
                                <Link
                                    href="/gt3open/standings"
                                    className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Standings
                                </Link>
                                <Link
                                    href="/gt3open/results"
                                    className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Results
                                </Link>
                                <Link
                                    href="/gt3open/rules"
                                    className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Rules
                                </Link>
                            </div>

                            {nextRace && (
                                <div className="mt-8 text-sm text-zinc-300">
                                    <span className="text-zinc-400">Next:</span>{" "}
                                    <span className="font-semibold text-white">
                    R{nextRace.round} · {nextRace.track}
                  </span>
                                    <span className="text-zinc-400"> · </span>
                                    <span>{formatStart(nextRace.start)}</span>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: COUNTDOWN */}
                        <div className="md:col-span-5">
                            {nextRace && (
                                <RaceCountdown
                                    targetIso={nextRace.start}
                                    subtitle={`R${nextRace.round} · ${nextRace.track}`}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK LINKS */}
            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-4 md:grid-cols-3">
                    <QuickCard
                        title="Schedule 赛程"
                        desc="所有轮次时间表，灰色为已结束的赛事"
                        href="/gt3open/schedule"
                    />
                    <QuickCard
                        title="Standings 积分"
                        desc="车手 / 车队积分榜"
                        href="/gt3open/standings"
                    />
                    <QuickCard
                        title="Results 成绩"
                        desc="过往比赛的结果"
                        href="/gt3open/results"
                    />
                </div>
            </section>
        </main>
    );
}

function QuickCard({
                       title,
                       desc,
                       href,
                   }: {
    title: string;
    desc: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
        >
            <div className="text-lg font-semibold text-white">{title}</div>
            <div className="mt-2 text-sm text-zinc-300 leading-relaxed">{desc}</div>
            <div className="mt-4 text-sm font-semibold text-zinc-100">Open →</div>
        </Link>
    );
}
