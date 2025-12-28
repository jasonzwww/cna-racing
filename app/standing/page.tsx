import { standingsData } from "@/lib/siteData";

export default function StandingPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">STANDING</p>
                    <h1 className="text-4xl font-semibold text-white">系列赛积分总榜</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        点击车手卡片可查看详细数据表现与赛季备注。
                    </p>
                </div>

                <div className="mt-10 grid gap-8">
                    {Object.values(standingsData).map((series) => (
                        <div key={series.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="text-lg font-semibold text-white">{series.title}</div>
                            <div className="mt-4 grid gap-3">
                                {series.rows.map((row) => (
                                    <details
                                        key={row.name}
                                        className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4"
                                    >
                                        <summary className="cursor-pointer list-none">
                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-amber-200">
                                                        #{row.rank}
                                                    </span>
                                                    <span className="text-base font-semibold text-white">
                                                        {row.name}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-zinc-300">{row.points} pts</div>
                                            </div>
                                        </summary>
                                        <div className="mt-3 grid gap-2 text-sm text-zinc-300">
                                            <div>Podiums: {row.podiums}</div>
                                            <div>Wins: {row.wins}</div>
                                            <div className="text-xs text-zinc-400">{row.notes}</div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
