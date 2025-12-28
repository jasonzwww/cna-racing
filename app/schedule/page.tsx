import { ScheduleClient } from "@/app/schedule/ScheduleClient";

type SchedulePageProps = {
    searchParams?: {
        series?: string;
    };
};

export default function SchedulePage({ searchParams }: SchedulePageProps) {
    const initialFilter: "all" | "gt3open" | "rookie" =
        searchParams?.series === "gt3open" || searchParams?.series === "rookie"
            ? searchParams.series
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
                    <ScheduleClient initialFilter={initialFilter} />
                </div>
            </section>
        </main>
    );
}
