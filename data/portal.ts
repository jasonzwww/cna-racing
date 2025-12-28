import { gt3open } from "@/data/gt3open";
import { rookie } from "@/data/rookie";

export type SeriesInfo = {
    key: "gt3open" | "rookie";
    name: string;
    shortName: string;
    hero: string;
    description: string;
    theme: string;
    highlights: string[];
    schedule: { round: number; track: string; start: string; format?: string }[];
};

export const seriesCatalog: SeriesInfo[] = [
    {
        key: "gt3open",
        name: "CNA GT3 Open",
        shortName: "GT3 Open",
        hero: "/gt3open/covers/imola.png",
        description: "旗舰 GT3 系列赛，强调长距离节奏与团队策略。",
        theme: "bg-gradient-to-br from-slate-900 via-indigo-900/70 to-black",
        highlights: ["双计分段", "强制进站", "专业裁判"],
        schedule: gt3open.races.map((race) => ({
            round: race.round,
            track: race.track,
            start: race.start,
            format: race.format,
        })),
    },
    {
        key: "rookie",
        name: "CNA Rookie Cup",
        shortName: "Rookie Cup",
        hero: "/mx5.jpg",
        description: "新手友好系列，专注学习赛车礼仪与节奏控制。",
        theme: "bg-gradient-to-br from-zinc-900 via-emerald-900/70 to-black",
        highlights: ["入门节奏", "同步培训", "公平分组"],
        schedule: rookie.races.map((race) => ({
            round: race.round,
            track: race.track,
            start: race.start,
            format: race.format,
        })),
    },
];

export const standingsData = {
    gt3open: [
        {
            name: "Liang Arrow",
            team: "Skyline Racing",
            points: 188,
            wins: 2,
            podiums: 5,
            starts: 6,
            gap: "-",
        },
        {
            name: "Zhou Nova",
            team: "Crimson GT",
            points: 176,
            wins: 1,
            podiums: 4,
            starts: 6,
            gap: "-12",
        },
        {
            name: "Marcus Yao",
            team: "Lionheart",
            points: 162,
            wins: 1,
            podiums: 3,
            starts: 6,
            gap: "-26",
        },
    ],
    rookie: [
        {
            name: "Chen Rui",
            team: "CNA Academy",
            points: 134,
            wins: 3,
            podiums: 4,
            starts: 6,
            gap: "-",
        },
        {
            name: "Kaito",
            team: "Rookie Lab",
            points: 121,
            wins: 1,
            podiums: 3,
            starts: 6,
            gap: "-13",
        },
        {
            name: "Hannah Lee",
            team: "CNA Academy",
            points: 110,
            wins: 1,
            podiums: 2,
            starts: 6,
            gap: "-24",
        },
    ],
};

export const resultsSeasons = [
    {
        season: "26S1",
        status: "current",
        series: "GT3 Open",
        highlight: "Leader: Liang Arrow",
        rounds: [
            {
                round: 1,
                track: "Imola",
                overview: {
                    p1: "Liang Arrow",
                    p2: "Zhou Nova",
                    p3: "Marcus Yao",
                    car: "Ferrari 296 GT3",
                    interval: "+2.4s",
                },
                detail: [
                    { position: 1, driver: "Liang Arrow", car: "Ferrari 296 GT3", interval: "-" },
                    { position: 2, driver: "Zhou Nova", car: "Porsche 911 GT3 R", interval: "+2.4s" },
                    { position: 3, driver: "Marcus Yao", car: "BMW M4 GT3", interval: "+6.8s" },
                ],
            },
            {
                round: 2,
                track: "Silverstone",
                overview: {
                    p1: "Zhou Nova",
                    p2: "Liang Arrow",
                    p3: "Ken Wu",
                    car: "Porsche 911 GT3 R",
                    interval: "+1.1s",
                },
                detail: [
                    { position: 1, driver: "Zhou Nova", car: "Porsche 911 GT3 R", interval: "-" },
                    { position: 2, driver: "Liang Arrow", car: "Ferrari 296 GT3", interval: "+1.1s" },
                    { position: 3, driver: "Ken Wu", car: "Mercedes-AMG GT3", interval: "+5.2s" },
                ],
            },
        ],
    },
    {
        season: "25S4",
        status: "past",
        series: "GT3 Open",
        highlight: "Winner: Marcus Yao",
        rounds: [
            {
                round: 12,
                track: "Spa",
                overview: {
                    p1: "Marcus Yao",
                    p2: "Liang Arrow",
                    p3: "Sato Min",
                    car: "BMW M4 GT3",
                    interval: "+7.6s",
                },
                detail: [
                    { position: 1, driver: "Marcus Yao", car: "BMW M4 GT3", interval: "-" },
                    { position: 2, driver: "Liang Arrow", car: "Ferrari 296 GT3", interval: "+7.6s" },
                    { position: 3, driver: "Sato Min", car: "Audi R8 LMS", interval: "+11.3s" },
                ],
            },
        ],
    },
    {
        season: "25S4",
        status: "past",
        series: "Rookie Cup",
        highlight: "Winner: Chen Rui",
        rounds: [
            {
                round: 10,
                track: "Summit Point",
                overview: {
                    p1: "Chen Rui",
                    p2: "Hannah Lee",
                    p3: "Kaito",
                    car: "Mazda MX-5",
                    interval: "+0.9s",
                },
                detail: [
                    { position: 1, driver: "Chen Rui", car: "Mazda MX-5", interval: "-" },
                    { position: 2, driver: "Hannah Lee", car: "Mazda MX-5", interval: "+0.9s" },
                    { position: 3, driver: "Kaito", car: "Mazda MX-5", interval: "+1.5s" },
                ],
            },
        ],
    },
];

export const driversRoster = [
    {
        id: "liang-arrow",
        name: "Liang Arrow",
        ir: 3450,
        sr: "A 4.32",
        series: ["GT3 Open"],
        history: [
            { season: "26S1", result: "P1 · 188 pts" },
            { season: "25S4", result: "P2 · 210 pts" },
        ],
    },
    {
        id: "zhou-nova",
        name: "Zhou Nova",
        ir: 3180,
        sr: "A 3.98",
        series: ["GT3 Open"],
        history: [
            { season: "26S1", result: "P2 · 176 pts" },
            { season: "25S4", result: "P4 · 178 pts" },
        ],
    },
    {
        id: "chen-rui",
        name: "Chen Rui",
        ir: 2420,
        sr: "B 3.72",
        series: ["Rookie Cup"],
        history: [
            { season: "26S1", result: "P1 · 134 pts" },
            { season: "25S4", result: "P1 · 146 pts" },
        ],
    },
    {
        id: "hannah-lee",
        name: "Hannah Lee",
        ir: 2275,
        sr: "B 3.48",
        series: ["Rookie Cup"],
        history: [
            { season: "26S1", result: "P3 · 110 pts" },
            { season: "25S4", result: "P2 · 132 pts" },
        ],
    },
];

export const profileSnapshot = {
    name: "Your Driver",
    ir: 2875,
    sr: "A 3.65",
    team: "CNA Racing",
    favoriteCar: "Porsche 911 GT3 R",
    seasons: [
        { season: "26S1", series: "GT3 Open", result: "P5 · 140 pts" },
        { season: "25S4", series: "Rookie Cup", result: "P2 · 132 pts" },
    ],
    stats: [
        { label: "Starts", value: "18" },
        { label: "Podiums", value: "6" },
        { label: "Wins", value: "2" },
        { label: "Clean Laps", value: "92%" },
    ],
};
