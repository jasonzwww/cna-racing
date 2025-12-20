"use client";

import { useEffect, useState } from "react";

type LocalTimeProps = {
    iso?: string | null;
    /** 是否显示时区缩写，如 GMT+8 / EST / EDT */
    showTzName?: boolean;
};

/**
 * LocalTime
 * - 接收一个「带时区的 ISO 字符串」
 * - 自动按【用户浏览器时区】显示
 * - SSR 安全（避免 hydration mismatch）
 */
export default function LocalTime({ iso, showTzName }: LocalTimeProps) {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (!iso) {
            setText("—");
            return;
        }

        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) {
            setText("Invalid time");
            return;
        }

        const formatted = d.toLocaleString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            ...(showTzName ? { timeZoneName: "short" } : {}),
        });

        setText(formatted);
    }, [iso, showTzName]);

    return (
        <span suppressHydrationWarning>
      {text || "—"}
    </span>
    );
}
