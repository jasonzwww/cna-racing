"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type NavItem = { label: string; href: string };

export function TopNav() {
    const pathname = usePathname();
    const [wechatOpen, setWechatOpen] = useState(false);

    // ✅ 改这里：Discord 真链接
    const DISCORD_URL = "https://discord.gg/J3PwH5n2by";

    // ✅ 改这里：微信群二维码图片路径（放到 public 里）
    const WECHAT_QR_SRC = "wechat.jpg";

    const navItems: NavItem[] = useMemo(
        () => [
            { label: "Home", href: "/" },
            { label: "GT3 Open", href: "/gt3open" },
            { label: "Schedule 赛程", href: "/gt3open/schedule" },
            { label: "Standings 积分", href: "/gt3open/standings" },
            { label: "Results 结果", href: "/gt3open/results" },
            { label: "Rules 规则", href: "/gt3open/rules" },
        ],
        []
    );

    // ESC 关闭弹窗
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setWechatOpen(false);
        }
        if (wechatOpen) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [wechatOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* 左侧：Logo + 文案（你有 logo 就把 img 换成你的路径） */}
                        <Link href="/" className="flex items-center gap-3">
                            {/* 你有 logo 的话取消注释，并把 src 改成你的 logo */}
                            <img src="/logo.png" alt="CNA Racing" className="h-9 w-auto" />
                            <div className="flex flex-col leading-tight">
                                <div className="text-sm font-semibold tracking-wide text-zinc-100">
                                    CNA RACING
                                </div>
                                <div className="text-[11px] tracking-widest text-zinc-400">
                                    SIM RACING LEAGUE
                                </div>
                            </div>
                        </Link>

                        {/* 中间导航 */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const active =
                                    item.href === "/"
                                        ? pathname === "/"
                                        : pathname?.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={[
                                            "rounded-xl px-3 py-2 text-sm font-semibold transition",
                                            active
                                                ? "text-white bg-white/10"
                                                : "text-zinc-300 hover:text-white hover:bg-white/5",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* 右侧按钮：Discord + WeChat */}
                        <div className="flex items-center gap-2">
                            <a
                                href={DISCORD_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
                            >
                                Discord
                            </a>

                            <button
                                onClick={() => setWechatOpen(true)}
                                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:opacity-90"
                            >
                                微信群
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ✅ WeChat QR 弹窗 */}
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

                        <div className="mt-3 text-xs text-zinc-400">
                            扫码加入（如无法加入，先加群主微信再拉群）
                            群主微信: pentadddghb 记得要备注: 加入CNA
                        </div>

                        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white">
                            <img
                                src={WECHAT_QR_SRC}
                                alt="WeChat Group QR"
                                className="h-auto w-full"
                            />
                        </div>

                        <div className="mt-3 text-xs text-zinc-500">
                            点击空白处或按 ESC 关闭
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
