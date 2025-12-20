"use client";

import { useEffect, useState } from "react";

type LocalTimeProps = {
    iso?: string | null;

    /** 是否显示时区缩写，如 GMT+8 / EST / EDT（你现在项目在用） */
    showTzName?: boolean;

    /** 新别名（可选，用哪个都行） */
    withTz?: boolean;

    className?: string;
};

/**
 * LocalTime
 * - 接收【带时区的 ISO 字符串】（Z / ±HH:MM）
 * - 自动转换为【用户浏览器所在时区】
 * - SSR 安全（避免 hydration mismatch）
 * - showTzName / withTz 都支持
 */
export default function LocalTime({
                                      iso,
                                      showTzName,
                                      withTz,
                                      className,
                                  }: LocalTimeProps) {
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

        // 优先级：showTzName > withTz > 默认 false
        const tzOn = showTzName ?? withTz ?? false;

        const formatted = d.toLocaleString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            ...(tzOn ? { timeZoneName: "short" } : {}),
        });

        setText(formatted);
    }, [iso, showTzName, withTz]);

    return (
        <span className={className} suppressHydrationWarning>
      {text || "—"}
    </span>
    );
}
