import { Suspense } from "react";
import Link from "next/link";
import ResultsViewClient from "./ResultsViewClient";

export default function ResultsViewPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="mx-auto max-w-6xl px-6 py-12">
                {/* 你也可以把这个 header 删掉，客户端里已经有 back 按钮 */}
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <div className="text-xs tracking-widest text-zinc-400">CNA GT3 OPEN</div>
                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Results View</h1>
                        <p className="mt-2 text-sm text-zinc-300">
                            该页面通过 query 参数携带 CSV 数据进行展示（build 需要 Suspense 包裹）。
                        </p>
                    </div>

                    <Link
                        href="/gt3open/results"
                        className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                    >
                        ← Back
                    </Link>
                </div>

                <div className="mt-8">
                    <Suspense
                        fallback={
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-zinc-300">
                                Loading…
                            </div>
                        }
                    >
                        <ResultsViewClient />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
