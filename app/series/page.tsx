import Link from "next/link";
import Image from "next/image";
import { RaceCountdown } from "@/components/RaceCountdown";
import { getNextRace, seriesCatalog } from "@/lib/series";
import LocalTime from "@/components/LocalTime";

export default function SeriesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-12">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA SERIES</div>
                        <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">
                            全部系列赛
                        </h1>
                        <p className="mt-2 text-zinc-300">
                            两条主线系列赛展示了 CNA 的赛事理念与视觉风格，点击进入即可查看完整规则与理念。
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    {seriesCatalog.map((series) => {
                        const nextRace = getNextRace(series.races);

                        return (
                            <Link
                                key={series.key}
                                href={series.href}
                                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${series.accent}`} />
                                <Image
                                    src={series.heroImage}
                                    alt={series.seriesName}
                                    width={1200}
                                    height={800}
                                    className="absolute inset-0 h-full w-full object-cover opacity-30"
                                />
                                <div className="relative p-8 md:p-10">
                                    <div className="text-xs tracking-widest text-zinc-300">{series.tagline}</div>
                                    <h2 className="mt-3 text-3xl font-semibold text-white">{series.seriesName}</h2>
                                    <div className="mt-2 text-sm text-zinc-200">{series.seasonName}</div>
                                    <p className="mt-4 max-w-xl text-sm text-zinc-200 leading-relaxed">
                                        {series.description}
                                    </p>

                                    {nextRace ? (
                                        <div className="mt-6 rounded-2xl border border-white/15 bg-zinc-950/60 p-4">
                                            <div className="text-xs tracking-widest text-zinc-400">NEXT RACE</div>
                                            <div className="mt-2 text-lg font-semibold text-white">
                                                R{nextRace.round} · {nextRace.track}
                                            </div>
                                            <div className="mt-2 text-sm text-zinc-300">
                                                <LocalTime iso={nextRace.start} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-6 text-sm text-zinc-400">暂无即将开始的赛事</div>
                                    )}

                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
                                        Enter Series →
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 pb-16">
                <div className="grid gap-6 lg:grid-cols-2">
                    {seriesCatalog.map((series) => {
                        const nextRace = getNextRace(series.races);
                        return (
                            <div
                                key={`${series.key}-countdown`}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-xs tracking-widest text-zinc-400">COUNTDOWN</div>
                                        <div className="mt-2 text-xl font-semibold text-white">
                                            {series.label}
                                        </div>
                                    </div>
                                    <Link
                                        href={series.scheduleHref}
                                        className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/10"
                                    >
                                        查看赛程
                                    </Link>
                                </div>

                                {nextRace ? (
                                    <div className="mt-4">
                                        <RaceCountdown
                                            targetIso={nextRace.start}
                                            subtitle={`R${nextRace.round} · ${nextRace.track}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="mt-4 text-sm text-zinc-400">暂无即将开始的赛事</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
