import { SeriesCountdown } from "@/app/series/SeriesCountdown";
import { seriesCatalog } from "@/data/portal";

export default function SeriesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_60%)]">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="text-xs tracking-[0.4em] text-zinc-400">SERIES</div>
                    <h1 className="mt-4 text-4xl font-semibold text-white">Choose Your Series</h1>
                    <p className="mt-3 max-w-2xl text-base text-zinc-300">
                        两个系列赛分别展示顶级竞赛与新手培养，完整的 Hero 视觉与下一场比赛倒计时在这里集中呈现。
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-8 lg:grid-cols-2">
                    {seriesCatalog.map((series) => (
                        <article
                            key={series.key}
                            className={`relative overflow-hidden rounded-3xl border border-white/10 ${series.theme}`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-50"
                                style={{ backgroundImage: `url('${series.hero}')` }}
                            />
                            <div className="absolute inset-0 bg-black/60" />
                            <div className="relative p-8">
                                <div className="text-xs uppercase tracking-[0.3em] text-zinc-300">
                                    {series.shortName}
                                </div>
                                <h2 className="mt-3 text-3xl font-semibold text-white">{series.name}</h2>
                                <p className="mt-3 text-sm text-zinc-200">{series.description}</p>

                                <div className="mt-6 flex flex-wrap gap-2">
                                    {series.highlights.map((item) => (
                                        <span
                                            key={item}
                                            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-zinc-100"
                                        >
                                            {item}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <SeriesCountdown schedule={series.schedule} />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
