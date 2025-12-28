import { profileSnapshot } from "@/data/portal";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%)]">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="text-xs tracking-[0.4em] text-zinc-400">PROFILE</div>
                    <h1 className="mt-4 text-4xl font-semibold text-white">个人资料</h1>
                    <p className="mt-3 max-w-2xl text-base text-zinc-300">
                        这里展示你的成绩与数据概览，方便查看每个赛季的表现与统计。
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">Driver</div>
                            <h2 className="mt-2 text-3xl font-semibold text-white">{profileSnapshot.name}</h2>
                            <div className="mt-2 text-sm text-zinc-300">
                                Team {profileSnapshot.team} · Favorite Car {profileSnapshot.favoriteCar}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm">
                                <div className="text-xs text-zinc-400">IR</div>
                                <div className="text-white">{profileSnapshot.ir}</div>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm">
                                <div className="text-xs text-zinc-400">SR</div>
                                <div className="text-white">{profileSnapshot.sr}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {profileSnapshot.stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-2xl border border-white/10 bg-black/40 p-4"
                            >
                                <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">{stat.label}</div>
                                <div className="mt-2 text-2xl font-semibold text-white">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">Season Results</div>
                        <div className="mt-4 space-y-3">
                            {profileSnapshot.seasons.map((season) => (
                                <div
                                    key={`${season.series}-${season.season}`}
                                    className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm"
                                >
                                    <div className="font-semibold text-white">
                                        Season {season.season} · {season.series}
                                    </div>
                                    <div className="text-xs text-zinc-400">{season.result}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
