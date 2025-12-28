import { ResultsClient } from "@/app/results/ResultsClient";

export default function ResultsPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">RESULTS</p>
                    <h1 className="text-4xl font-semibold text-white">赛季结果与历史回顾</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        当前赛季显示积分 Leader，过去赛季显示冠军 Winner。点击赛季可查看每一场比赛的 overview，并可展开官方 .json 的完整数据。
                    </p>
                </div>
                <div className="mt-10">
                    <ResultsClient />
                </div>
            </section>
        </main>
    );
}
