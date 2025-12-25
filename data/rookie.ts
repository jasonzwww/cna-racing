export type RookieRace = {
    round: number;
    track: string;
    start: string; // ISO with timezone or Z (UTC)
    format?: string;
    note?: string;
    broadcast?: string;
};

export const rookie = {
    seriesName: "CNA 新手赛",
    seasonName: "Season 26S1",
    races: [
        {
            round: 1,
            track: "Circuito de Navarra 纳瓦拉",
            start: "2025-12-27T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
            note: "揭幕战",
        },
        {
            round: 2,
            track: "Lime Rock Park 莱姆洛克",
            start: "2026-01-03T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 3,
            track: "Summit Point Raceway 萨米特角",
            start: "2026-01-10T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 4,
            track: "Tsukuba Circuit 筑波",
            start: "2026-01-17T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 5,
            track: "Circuit de Lédenon 勒德农",
            start: "2026-01-24T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 6,
            track: "Oulton Park Circuit 奥尔顿公园",
            start: "2026-01-31T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 7,
            track: "Charlotte Motor Speedway 夏洛特",
            start: "2026-02-07T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 8,
            track: "Winton Motor Raceway 温顿",
            start: "2026-02-14T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 9,
            track: "Okayama International Circuit 冈山",
            start: "2026-02-21T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
        },
        {
            round: 10,
            track: "Summit Point Raceway 萨米特角",
            start: "2026-02-28T04:00:00Z",
            format: "MX-5 Cup · P(20min) + Q(20min) + R(20min)",
            note: "收官战",
        },
    ] satisfies RookieRace[],
};
