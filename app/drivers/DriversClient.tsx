"use client";

import { useState } from "react";
import { driversData } from "@/lib/siteData";

export function DriversClient() {
    const [selectedId, setSelectedId] = useState(driversData[0]?.id ?? "");
    const selected = driversData.find((driver) => driver.id === selectedId) ?? driversData[0];

    return (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
                {driversData.map((driver) => (
                    <button
                        key={driver.id}
                        onClick={() => setSelectedId(driver.id)}
                        className={[
                            "rounded-2xl border border-white/10 p-4 text-left transition",
                            selectedId === driver.id ? "bg-white/10" : "bg-white/5 hover:bg-white/10",
                        ].join(" ")}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-white">{driver.name}</div>
                            <div className="text-xs text-zinc-400">IR {driver.ir}</div>
                        </div>
                        <div className="mt-1 text-sm text-zinc-300">{driver.bio}</div>
                        <div className="mt-2 text-xs text-zinc-400">SR {driver.sr}</div>
                    </button>
                ))}
            </div>

            {selected && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="text-sm tracking-[0.3em] text-zinc-400">DRIVER PROFILE</div>
                    <div className="mt-3 text-2xl font-semibold text-white">{selected.name}</div>
                    <div className="mt-2 text-sm text-zinc-300">{selected.bio}</div>

                    <div className="mt-4 grid gap-2 text-sm text-zinc-200">
                        <div>iRating: {selected.ir}</div>
                        <div>Safety Rating: {selected.sr}</div>
                    </div>

                    <div className="mt-6">
                        <div className="text-xs tracking-widest text-zinc-400">参赛记录</div>
                        <ul className="mt-2 space-y-2 text-sm text-zinc-200">
                            {selected.history.map((item) => (
                                <li key={item} className="rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
