import Link from "next/link";
import { ScheduleClient } from "@/app/schedule/ScheduleClient";

type SchedulePageProps = {
    searchParams?: Promise<{
        series?: string;
    }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
    const resolvedSearchParams = (await searchParams) ?? {};
    const initialFilter: "all" | "gt3open" | "rookie" =
        resolvedSearchParams.series === "gt3open" || resolvedSearchParams.series === "rookie"
            ? resolvedSearchParams.series
            : "all";

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">SCHEDULE</p>
                    <h1 className="text-4xl font-semibold text-white">官方赛程</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        默认展示所有系列赛赛程，可使用按钮单独筛选。下一场比赛会高亮显示，已结束比赛将灰色处理。
                    </p>
                </div>
                <div className="mt-10">
                    <div className="mb-6 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs tracking-widest text-zinc-400">GT3 OPEN</div>
                            <div className="mt-2 text-sm text-zinc-200">
                                前往 GT3 Open 专属赛程页面（含详细说明与高亮）。
                            </div>
                            <Link
                                href="/gt3open/schedule"
                                className="mt-3 inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                打开 GT3 Open 赛程
                            </Link>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="text-xs tracking-widest text-zinc-400">ROOKIE</div>
                            <div className="mt-2 text-sm text-zinc-200">
                                前往新手赛专属赛程页面（含详细说明与高亮）。
                            </div>
                            <Link
                                href="/rookie/schedule"
                                className="mt-3 inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                打开 新手赛 赛程
                            </Link>
                        </div>
                    </div>
                    <ScheduleClient initialFilter={initialFilter} />
                </div>
            </section>
        </main>
    );
}
