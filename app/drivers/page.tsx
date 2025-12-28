"use client";

import { useState } from "react";
import { driversRoster } from "@/data/portal";

export default function DriversPage() {
    const [activeId, setActiveId] = useState<string | null>(driversRoster[0]?.id ?? null);
    const activeDriver = driversRoster.find((driver) => driver.id === activeId);

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100">
            <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%)]">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="text-xs tracking-[0.4em] text-zinc-400">DRIVERS</div>
                    <h1 className="mt-4 text-4xl font-semibold text-white">车手档案</h1>
                    <p className="mt-3 max-w-2xl text-base text-zinc-300">
                        展示所有参与 CNA 比赛的车手，点击查看过往赛季记录、IR 与 SR 数据。
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-12">
                <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <div className="space-y-3">
                        {driversRoster.map((driver) => (
                            <button
                                key={driver.id}
                                onClick={() => setActiveId(driver.id)}
                                className={[
                                    "w-full rounded-2xl border border-white/10 px-4 py-3 text-left transition",
                                    activeId === driver.id ? "bg-white/10" : "bg-white/5 hover:bg-white/10",
                                ].join(" ")}
                            >
                                <div className="text-sm font-semibold text-white">{driver.name}</div>
                                <div className="text-xs text-zinc-400">{driver.series.join(" · ")}</div>
                            </button>
                        ))}
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        {activeDriver ? (
                            <>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">Driver</div>
                                        <h2 className="mt-2 text-2xl font-semibold text-white">{activeDriver.name}</h2>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm">
                                            <div className="text-xs text-zinc-400">IR</div>
                                            <div className="text-white">{activeDriver.ir}</div>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm">
                                            <div className="text-xs text-zinc-400">SR</div>
                                            <div className="text-white">{activeDriver.sr}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                                        Participation History
                                    </div>
                                    <ul className="mt-3 space-y-2">
                                        {activeDriver.history.map((item) => (
                                            <li
                                                key={`${activeDriver.id}-${item.season}`}
                                                className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm"
                                            >
                                                <div className="font-semibold text-white">Season {item.season}</div>
                                                <div className="text-xs text-zinc-400">{item.result}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-zinc-400">Select a driver to view details.</div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
