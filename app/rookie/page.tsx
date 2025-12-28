import Link from "next/link";
import { rookie, RookieRace } from "@/data/rookie";
import { RaceCountdown } from "@/components/RaceCountdown";

function isPast(r: RookieRace, now: Date) {
    return new Date(r.start).getTime() < now.getTime();
}

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

export default function RookieOverviewPage() {
    const now = new Date();

    const races = rookie.races
        .slice()
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const nextRace = races.find((r) => !isPast(r, now)) ?? null;

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div
                    className="absolute inset-0 bg-cover bg-[position:50%_70%]"
                    style={{ backgroundImage: "url('/mx5.jpg')" }}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 opacity-35 [background:radial-gradient(70%_60%_at_50%_10%,rgba(255,255,255,0.22),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:60px_60px]" />

                <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
                    <div className="grid gap-8 md:grid-cols-12 md:items-start">
                        <div className="md:col-span-7">
                            <div className="inline-flex items-center gap-2 text-xs tracking-widest text-zinc-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                OFFICIAL SERIES PAGE
                            </div>

                            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight text-white">
                                {rookie.seriesName}
                            </h1>

                            <p className="mt-3 text-lg text-zinc-200">{rookie.seasonName}</p>

                            <p className="mt-5 max-w-2xl text-zinc-200 leading-relaxed">
                                面向新手与回归车手的入门系列赛：节奏更友好、关闭车损、强调安全与学习。
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="/rookie/schedule"
                                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:opacity-90"
                                >
                                    View Schedule
                                </Link>
                                <Link
                                    href="/rookie/results"
                                    className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Results
                                </Link>
                                <Link
                                    href="/rookie/standings"
                                    className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                                >
                                    Standings
                                </Link>
                                <Link
                                    href="/rookie/rules"
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
                    <QuickCard title="Schedule 赛程" desc="所有轮次时间表" href="/rookie/schedule" />
                    <QuickCard title="Results 成绩" desc="过往比赛结果" href="/rookie/results" />
                    <QuickCard title="Rules 规则" desc="新手友好规则说明" href="/rookie/rules" />
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-16">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                    <div className="text-xs tracking-widest text-zinc-400">SERIES VISION</div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">新手友好理念</h2>
                    <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
                        CNA 新手赛为初次参赛与回归车手打造，强调安全、学习与节奏培养。
                        规则清晰、赛程紧凑，帮助大家建立稳定的比赛习惯。
                    </p>
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <VisionCard title="安全优先" desc="比赛节奏适中，鼓励干净公平的对抗。" />
                        <VisionCard title="清晰节奏" desc="固定格式与简化流程，降低学习成本。" />
                        <VisionCard title="成长路线" desc="从新手赛逐步过渡到高阶系列赛。" />
                    </div>
                    <div className="mt-6">
                        <Link
                            href="/rookie/rules"
                            className="inline-flex rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                            查看完整规则 →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

function QuickCard({ title, desc, href }: { title: string; desc: string; href: string }) {
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

function VisionCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
            <div className="text-sm font-semibold text-white">{title}</div>
            <div className="mt-2 text-sm text-zinc-300 leading-relaxed">{desc}</div>
        </div>
    );
}
