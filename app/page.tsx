import Link from "next/link";

export default function MainHomePage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/10">
                {/* background image (1536x1024, 3:2) */}
                <div
                    className="absolute inset-0 bg-cover bg-[position:50%_70%]"
                    style={{ backgroundImage: "url('/main-bg.png')" }}
                />

                {/* dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60" />

                {/* subtle broadcast glow */}
                <div className="absolute inset-0 opacity-35 [background:radial-gradient(70%_60%_at_50%_10%,rgba(255,255,255,0.22),transparent_60%)]" />

                {/* content */}
                <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
                    <div className="flex flex-col gap-8">
                        <div className="text-xs tracking-widest text-zinc-300">
                            OFFICIAL SIM RACING ORGANIZATION
                        </div>

                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                            CNA Racing
                        </h1>

                        <p className="max-w-2xl text-lg text-zinc-200 leading-relaxed">
                            CNA Racing 是一个专注于高质量赛事组织的模拟赛车联赛平台。
                            官方赛程、积分与规则统一发布。
                        </p>

                        {/* Series entry */}
                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <Link
                                href="/gt3open"
                                className="rounded-2xl border border-white/20 bg-white/10 p-6 hover:bg-white/20 transition"
                            >
                                <div className="text-lg font-semibold text-white">
                                    GT3 Open
                                </div>
                                <div className="mt-2 text-sm text-zinc-200">
                                    多站点 GT3 系列赛 · 官方积分 · 裁判系统
                                </div>
                                <div className="mt-4 text-sm font-semibold text-white">
                                    Enter →
                                </div>
                            </Link>

                            <Link
                                href="/rookie"
                                className="rounded-2xl border border-white/20 bg-white/10 p-6 hover:bg-white/20 transition"
                            >
                                <div className="text-lg font-semibold text-white">CNA 新手赛</div>
                                <div className="mt-2 text-sm text-zinc-200">入门系列 · 更友好的节奏 · 更清晰的规则</div>
                                <div className="mt-4 text-sm font-semibold text-white">Enter →</div>
                            </Link>


                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 opacity-60">
                                <div className="text-lg font-semibold">
                                    More Series
                                </div>
                                <div className="mt-2 text-sm text-zinc-300">
                                    Coming soon
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-10 flex flex-wrap gap-3">
                            <a
                                href="#"
                                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                            >
                                Discord
                            </a>
                            <a
                                href="#"
                                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:opacity-90"
                            >
                                Join
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
