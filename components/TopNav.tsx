"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function TopNav() {
    const pathname = usePathname();

    const [wechatOpen, setWechatOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // ✅ Discord 真链接
    const DISCORD_URL = "https://discord.gg/J3PwH5n2by";

    // ✅ 微信群二维码图片：放到 public/wechat.jpg
    const WECHAT_QR_SRC = "/wechat.jpg";

    const navItems = useMemo(
        () => [
            { label: "Home", href: "/" },
            { label: "Series", href: "/series" },
            { label: "Schedule", href: "/schedule" },
            { label: "Standing", href: "/standing" },
            { label: "Results", href: "/results" },
            { label: "Drivers", href: "/drivers" },
        ],
        []
    );

    function isActive(href: string) {
        if (href === "/") return pathname === "/";
        return pathname?.startsWith(href);
    }

    // ESC 关闭弹窗/菜单
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setWechatOpen(false);
                setMobileOpen(false);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    // 路由变化时收起移动菜单
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Left: Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="CNA Racing" className="h-9 w-auto" />
                            <div className="hidden sm:flex flex-col leading-tight">
                                <div className="text-sm font-semibold tracking-wide text-zinc-100">
                                    CNA RACING
                                </div>
                                <div className="text-[11px] tracking-widest text-zinc-400">
                                    SIM RACING LEAGUE
                                </div>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={[
                                        "rounded-xl px-3 py-2 text-sm font-semibold transition",
                                        isActive(item.href)
                                            ? "text-white bg-white/10"
                                            : "text-zinc-300 hover:text-white hover:bg-white/5",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2">
                            <a
                                href={DISCORD_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="hidden sm:inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                Discord
                            </a>

                            <Link
                                href="/profile"
                                className="hidden sm:inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                Profile
                            </Link>

                            <button
                                onClick={() => setWechatOpen(true)}
                                className="hidden sm:inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                            >
                                微信群
                            </button>

                            {/* Mobile hamburger */}
                            <button
                                className="md:hidden rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
                                onClick={() => setMobileOpen((v) => !v)}
                                aria-expanded={mobileOpen}
                                aria-label="Open menu"
                            >
                                ☰
                            </button>
                        </div>
                    </div>

                    {/* Mobile panel */}
                    {mobileOpen && (
                        <div className="md:hidden pb-4">
                            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                                <div className="p-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={[
                                                "block rounded-xl px-3 py-2 text-sm font-semibold transition",
                                                isActive(item.href)
                                                    ? "bg-white/10 text-white"
                                                    : "text-zinc-300 hover:bg-white/5 hover:text-white",
                                            ].join(" ")}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}

                                    <div className="mt-3 flex gap-2 px-2 pb-2">
                                        <a
                                            href={DISCORD_URL}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10 text-center"
                                        >
                                            Discord
                                        </a>
                                        <button
                                            onClick={() => setWechatOpen(true)}
                                            className="flex-1 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                                        >
                                            微信群
                                        </button>
                                        <Link
                                            href="/profile"
                                            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10 text-center"
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* WeChat modal */}
            {wechatOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6"
                    onClick={() => setWechatOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-zinc-100">加入微信群</div>
                            <button
                                onClick={() => setWechatOpen(false)}
                                className="rounded-lg px-2 py-1 text-zinc-300 hover:bg-white/10 hover:text-white"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-3 text-xs text-zinc-400 leading-relaxed">
                            扫码加入（如无法加入，先加群主微信再拉群）
                            <br />
                            群主微信: <span className="font-semibold text-zinc-200">pentadddghb</span>（备注：加入CNA）
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white">
                            <img src={WECHAT_QR_SRC} alt="WeChat Group QR" className="h-auto w-full" />
                        </div>

                        <div className="mt-3 text-xs text-zinc-500">点击空白处或按 ESC 关闭</div>
                    </div>
                </div>
            )}
        </>
    );
}
