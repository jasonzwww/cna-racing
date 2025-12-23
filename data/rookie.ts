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
            track: "Okayama International Circuit 冈山",
            start: "2026-01-25T03:59:00Z",
            format: "P(30分钟) + Q(10分钟) + R(25分钟)",
            note: "揭幕战",
            broadcast: undefined,
        },
        {
            round: 2,
            track: "Virginia International Raceway VIR",
            start: "2026-02-01T03:59:00Z",
            format: "P(30分钟) + Q(10分钟) + R(25分钟)",
            broadcast: undefined,
        },
    ] satisfies RookieRace[],
};
