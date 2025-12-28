import { SeriesClient } from "@/app/series/SeriesClient";

export default function SeriesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">SERIES</p>
                    <h1 className="text-4xl font-semibold text-white">双系列赛展示</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        选择你感兴趣的系列赛，查看炫酷的视觉展示、下一场比赛倒计时与重点信息。
                    </p>
                </div>
                <div className="mt-10">
                    <SeriesClient />
                </div>
            </section>
        </main>
    );
}
