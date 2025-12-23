import Link from "next/link";

export default function RookieRulesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA ROOKIE</div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Rules 规则</h1>
                        <p className="mt-2 text-zinc-300">先占位：你把规则文本发我，我给你做成干净的章节页。</p>
                    </div>
                    <Link
                        href="/rookie"
                        className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back
                    </Link>
                </div>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                    TODO: 新手赛规则（安全驾驶、让车、复盘、处罚尺度等）
                </div>
            </div>
        </main>
    );
}
