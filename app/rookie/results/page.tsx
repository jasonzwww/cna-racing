import Link from "next/link";

export default function RookieResultsPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA ROOKIE</div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Results 成绩</h1>
                        <p className="mt-2 text-zinc-300">先占位。等你把 iRacing JSON 放进 public 后直接复用 GT3 的结果系统。</p>
                    </div>
                    <Link
                        href="/rookie"
                        className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back
                    </Link>
                </div>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                    还没有任何比赛结果（public/rookie/results/index.json 为空）。
                </div>
            </div>
        </main>
    );
}
