import { profileData } from "@/lib/siteData";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="flex flex-col gap-4">
                    <p className="text-xs tracking-[0.3em] text-zinc-400">PROFILE</p>
                    <h1 className="text-4xl font-semibold text-white">个人数据概览</h1>
                    <p className="max-w-2xl text-sm text-zinc-300">
                        在这里查看你的 CNA 赛事数据、近期参赛记录以及赛季成长。
                    </p>
                </div>

                <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="text-2xl font-semibold text-white">{profileData.name}</div>
                            <div className="text-sm text-zinc-400">{profileData.tag}</div>
                        </div>
                        <div className="flex gap-4 text-sm text-zinc-200">
                            <div className="rounded-full border border-white/10 px-4 py-2">IR {profileData.ir}</div>
                            <div className="rounded-full border border-white/10 px-4 py-2">SR {profileData.sr}</div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                            <div className="text-xs tracking-widest text-zinc-400">LAST RACE</div>
                            <div className="mt-2 text-sm font-semibold text-white">{profileData.lastRace}</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                            <div className="text-xs tracking-widest text-zinc-400">ACHIEVEMENTS</div>
                            <ul className="mt-2 space-y-2 text-sm text-zinc-200">
                                {profileData.achievements.map((item) => (
                                    <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
