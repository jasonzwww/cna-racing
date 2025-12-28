import { gt3open } from "@/data/gt3open";
import { rookie } from "@/data/rookie";

export type SeriesKey = "gt3open" | "rookie";

export type SeriesRace = {
    round: number;
    track: string;
    start: string;
    format?: string;
    note?: string;
    broadcast?: string;
};

export type SeriesDefinition = {
    key: SeriesKey;
    label: string;
    seriesName: string;
    seasonName: string;
    href: string;
    scheduleHref: string;
    standingsHref: string;
    resultsHref: string;
    rulesHref: string;
    heroImage: string;
    accent: string;
    tagline: string;
    description: string;
    races: SeriesRace[];
};

export const seriesCatalog: SeriesDefinition[] = [
    {
        key: "gt3open",
        label: "GT3 Open",
        seriesName: gt3open.seriesName,
        seasonName: gt3open.seasonName,
        href: "/gt3open",
        scheduleHref: "/gt3open/schedule",
        standingsHref: "/gt3open/standings",
        resultsHref: "/gt3open/results",
        rulesHref: "/gt3open/rules",
        heroImage: "/lineup.png",
        accent: "from-red-500/30 via-orange-400/10 to-transparent",
        tagline: "顶级 GT3 长距离挑战",
        description:
            "多站点 GT3 系列赛，强调耐力策略与团队配合。官方赛程与积分体系统一发布。",
        races: gt3open.races,
    },
    {
        key: "rookie",
        label: "CNA 新手赛",
        seriesName: rookie.seriesName,
        seasonName: rookie.seasonName,
        href: "/rookie",
        scheduleHref: "/rookie/schedule",
        standingsHref: "/rookie/standings",
        resultsHref: "/rookie/results",
        rulesHref: "/rookie/rules",
        heroImage: "/mx5.jpg",
        accent: "from-sky-400/30 via-indigo-400/10 to-transparent",
        tagline: "新手友好 · 节奏清晰",
        description:
            "MX-5 Cup 入门系列，节奏轻松但标准严格，帮助新人建立比赛节奏。",
        races: rookie.races,
    },
];

export function getSeriesDefinition(key: SeriesKey) {
    return seriesCatalog.find((series) => series.key === key) ?? null;
}

export function getNextRace(races: SeriesRace[], now = new Date()) {
    const sorted = races
        .slice()
        .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return sorted.find((race) => new Date(race.start).getTime() >= now.getTime()) ?? null;
}

export function isPastRace(race: SeriesRace, now = new Date()) {
    return new Date(race.start).getTime() < now.getTime();
}
