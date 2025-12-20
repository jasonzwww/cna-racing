"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
    iso: string; // e.g. 2026-01-25T03:59:00Z or 2026-02-21T20:00:00-05:00
    className?: string;
    withTz?: boolean;
};

function formatInBrowser(iso: string, withTz: boolean) {
    const d = new Date(iso);

    const base = new Intl.DateTimeFormat(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);

    if (!withTz) return base;

    const tz = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
        .formatToParts(d)
        .find((p) => p.type === "timeZoneName")?.value;

    return tz ? `${base} (${tz})` : base;
}

export default function LocalTime({ iso, className, withTz = true }: Props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const text = useMemo(() => {
        if (!mounted) return "—";
        return formatInBrowser(iso, withTz);
    }, [iso, withTz, mounted]);

    return (
        <span className={className} suppressHydrationWarning>
      {text}
    </span>
    );
}
