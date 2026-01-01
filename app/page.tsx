import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MainHomePage() {
    const supabase = await createClient()

    // Development-only connection test (safe and no false errors)
    let debugInfo = null
    if (process.env.NODE_ENV === 'development') {
        const { data: { user } } = await supabase.auth.getUser()

        // Try a very lightweight query that almost always works
        // We just check if we can reach the database at all
        const { error } = await supabase
            .from('information_schema.tables') // This built-in table always exists
            .select('table_name')
            .limit(1)

        debugInfo = {
            user,
            dbReachable: !error, // true if no error
            dbError: error?.message || null,
        }
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Development-only Debug Panel */}
            {process.env.NODE_ENV === 'development' && debugInfo && (
                <div className="fixed top-4 left-4 z-50 max-w-sm rounded-xl bg-black/90 p-5 text-sm text-zinc-100 shadow-2xl backdrop-blur-md border border-white/10">
                    <h3 className="mb-3 text-lg font-bold text-green-400">Supabase Connected ✅</h3>
                    <p>
                        <strong>User:</strong>{' '}
                        {debugInfo.user?.email || debugInfo.user?.id || 'Not logged in (anonymous OK)'}
                    </p>
                    <p className="mt-2">
                        <strong>Database:</strong>{' '}
                        {debugInfo.dbReachable ? (
                            <span className="text-green-400">Reachable ✅</span>
                        ) : (
                            <span className="text-red-400">Error: {debugInfo.dbError}</span>
                        )}
                    </p>
                    <p className="mt-3 text-xs opacity-70">This panel only shows in development</p>
                </div>
            )}

            {/* HERO SECTION */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div
                    className="absolute inset-0 bg-cover bg-[position:50%_70%]"
                    style={{ backgroundImage: "url('/main-bg.png')" }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 opacity-35 [background:radial-gradient(70%_60%_at_50%_10%,rgba(255,255,255,0.22),transparent_60%)]" />

                <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
                    <div className="flex flex-col gap-8">
                        <div className="text-xs tracking-widest text-zinc-300">
                            OFFICIAL SIM RACING ORGANIZATION
                        </div>

                        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
                            CNA Racing
                        </h1>

                        <p className="max-w-2xl text-lg text-zinc-200 leading-relaxed">
                            CNA Racing 是一个专注于高质量赛事组织的模拟赛车联赛平台。
                            官方赛程、积分与规则统一发布。
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Link
                                href="/gt3open"
                                className="rounded-2xl border border-white/20 bg-white/10 p-6 hover:bg-white/20 transition backdrop-blur-sm"
                            >
                                <div className="text-lg font-semibold text-white">GT3 Open</div>
                                <div className="mt-2 text-sm text-zinc-200">
                                    多站点 GT3 系列赛 · 官方积分 · 裁判系统
                                </div>
                                <div className="mt-4 text-sm font-semibold text-white">Enter →</div>
                            </Link>

                            <Link
                                href="/rookie"
                                className="rounded-2xl border border-white/20 bg-white/10 p-6 hover:bg-white/20 transition backdrop-blur-sm"
                            >
                                <div className="text-lg font-semibold text-white">CNA 新手赛</div>
                                <div className="mt-2 text-sm text-zinc-200">
                                    入门系列 · 更友好的节奏 · 更清晰的规则
                                </div>
                                <div className="mt-4 text-sm font-semibold text-white">Enter →</div>
                            </Link>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 opacity-60 backdrop-blur-sm">
                                <div className="text-lg font-semibold text-white">More Series</div>
                                <div className="mt-2 text-sm text-zinc-300">Coming soon</div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-3">
                            <a
                                href="https://discord.gg/your-discord" // ← put your real invite
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
                            >
                                Discord
                            </a>
                            <a
                                href="/signup" // or your registration page
                                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:opacity-90 transition"
                            >
                                Join
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}