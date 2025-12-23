import Link from "next/link";

export default function RookieRulesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA ROOKIE</div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Rules 规则</h1>
                    </div>
                    <Link
                        href="/rookie"
                        className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back
                    </Link>
                </div>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                   没有车损, 21x黑旗,之后每7x一次黑旗
                    当个绅士的有边界的车手
                </div>
            </div>
        </main>
    );
}
