import { DriversClient } from "@/app/drivers/DriversClient";

export default function DriversPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">DRIVERS</p>
                    <h1 className="text-4xl font-semibold text-white">参赛车手名单</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        查看所有登陆或参与过 CNA 比赛的用户，点击车手可查看过去参赛记录、iRating 与安全评分。
                    </p>
                </div>
                <div className="mt-10">
                    <DriversClient />
                </div>
            </section>
        </main>
    );
}
