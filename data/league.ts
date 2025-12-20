export type Race = {
    round: number;
    track: string;
    date: string; // YYYY-MM-DD
    series: string; // e.g. "CNA GT3 公开赛"
    server?: string; // e.g. "iRacing Hosted"
    note?: string;
};

export const leagueData: {
    leagueName: string;
    seasonName: string;
    races: Race[];
} = {
    leagueName: "CNA Racing",
    seasonName: "CNA GT3 公开赛",
    races: [
        { round: 1, track: "Watkins Glen", date: "2026-01-10", series: "CNA GT3 公开赛", server: "iRacing" },
        { round: 2, track: "Daytona", date: "2026-01-24", series: "CNA GT3 公开赛", server: "iRacing", note: "Night race" },
        { round: 3, track: "Road Atlanta", date: "2026-02-07", series: "CNA GT3 公开赛", server: "iRacing" },
    ],
};
