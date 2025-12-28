import { gt3open } from "@/data/gt3open";
import { rookie } from "@/data/rookie";

export type SeriesKey = "gt3open" | "rookie";

export const seriesMeta = [
    {
        key: "gt3open" as const,
        name: "GT3 Open",
        description: "高规格 GT3 系列赛 · 官方转播 · 高强度赛程",
        heroImage: "/gt3open/covers/spa.png",
        accent: "from-red-500/20 via-orange-500/10 to-transparent",
    },
    {
        key: "rookie" as const,
        name: "CNA 新手赛",
        description: "更友好节奏 · 入门向赛事 · 新人专属成长",
        heroImage: "/mx5.jpg",
        accent: "from-sky-500/20 via-blue-500/10 to-transparent",
    },
];

export const scheduleData = [
    ...gt3open.races.map((race) => ({
        id: `gt3-${race.round}`,
        seriesKey: "gt3open" as const,
        seriesLabel: gt3open.seriesName,
        round: race.round,
        track: race.track,
        start: race.start,
        format: race.format,
        note: race.note,
    })),
    ...rookie.races.map((race) => ({
        id: `rookie-${race.round}`,
        seriesKey: "rookie" as const,
        seriesLabel: rookie.seriesName,
        round: race.round,
        track: race.track,
        start: race.start,
        format: race.format,
        note: race.note,
    })),
].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

export const standingsData = {
    gt3open: {
        title: "GT3 Open 总积分",
        rows: [
            {
                rank: 1,
                name: "NightFox",
                points: 178,
                podiums: 6,
                wins: 2,
                notes: "稳定发挥，连续三场进入领奖台",
            },
            {
                rank: 2,
                name: "Ryo",
                points: 165,
                podiums: 5,
                wins: 1,
                notes: "长距离节奏优秀",
            },
            {
                rank: 3,
                name: "Suki",
                points: 158,
                podiums: 4,
                wins: 2,
                notes: "排位速度最快",
            },
        ],
    },
    rookie: {
        title: "新手赛 总积分",
        rows: [
            {
                rank: 1,
                name: "Mango",
                points: 132,
                podiums: 4,
                wins: 2,
                notes: "出色的节奏控制",
            },
            {
                rank: 2,
                name: "Yuki",
                points: 124,
                podiums: 3,
                wins: 1,
                notes: "进步幅度最大",
            },
            {
                rank: 3,
                name: "Axel",
                points: 118,
                podiums: 3,
                wins: 1,
                notes: "稳定成长中",
            },
        ],
    },
};

export const resultsData = {
    currentSeason: {
        id: "26S1",
        label: "Season 26S1",
        leader: "NightFox",
        rounds: [
            {
                id: "r1",
                name: "Round 1 · Imola",
                top: [
                    { position: 1, driver: "NightFox", car: "BMW M4 GT3", interval: "--" },
                    { position: 2, driver: "Ryo", car: "Porsche 911 GT3", interval: "+3.842" },
                    { position: 3, driver: "Suki", car: "Mercedes AMG GT3", interval: "+6.110" },
                ],
                full: [
                    { position: 1, driver: "NightFox", car: "BMW M4 GT3", interval: "--" },
                    { position: 2, driver: "Ryo", car: "Porsche 911 GT3", interval: "+3.842" },
                    { position: 3, driver: "Suki", car: "Mercedes AMG GT3", interval: "+6.110" },
                    { position: 4, driver: "Leo", car: "Ferrari 296 GT3", interval: "+8.402" },
                    { position: 5, driver: "Kai", car: "Audi R8 GT3", interval: "+12.301" },
                ],
            },
            {
                id: "r2",
                name: "Round 2 · Silverstone",
                top: [
                    { position: 1, driver: "Ryo", car: "Porsche 911 GT3", interval: "--" },
                    { position: 2, driver: "NightFox", car: "BMW M4 GT3", interval: "+1.204" },
                    { position: 3, driver: "Mori", car: "Lamborghini Huracan", interval: "+5.872" },
                ],
                full: [
                    { position: 1, driver: "Ryo", car: "Porsche 911 GT3", interval: "--" },
                    { position: 2, driver: "NightFox", car: "BMW M4 GT3", interval: "+1.204" },
                    { position: 3, driver: "Mori", car: "Lamborghini Huracan", interval: "+5.872" },
                    { position: 4, driver: "Suki", car: "Mercedes AMG GT3", interval: "+7.300" },
                ],
            },
        ],
    },
    pastSeasons: [
        {
            id: "25S2",
            label: "Season 25S2",
            winner: "Ryo",
            rounds: [
                {
                    id: "p1",
                    name: "Finale · Spa",
                    top: [
                        { position: 1, driver: "Ryo", car: "Porsche 911 GT3", interval: "--" },
                        { position: 2, driver: "NightFox", car: "BMW M4 GT3", interval: "+4.521" },
                        { position: 3, driver: "Nana", car: "Ferrari 296 GT3", interval: "+6.874" },
                    ],
                    full: [
                        { position: 1, driver: "Ryo", car: "Porsche 911 GT3", interval: "--" },
                        { position: 2, driver: "NightFox", car: "BMW M4 GT3", interval: "+4.521" },
                        { position: 3, driver: "Nana", car: "Ferrari 296 GT3", interval: "+6.874" },
                        { position: 4, driver: "Mori", car: "Lamborghini Huracan", interval: "+9.103" },
                    ],
                },
            ],
        },
        {
            id: "25S1",
            label: "Season 25S1",
            winner: "Suki",
            rounds: [
                {
                    id: "p2",
                    name: "Finale · Nürburgring",
                    top: [
                        { position: 1, driver: "Suki", car: "Mercedes AMG GT3", interval: "--" },
                        { position: 2, driver: "Ryo", car: "Porsche 911 GT3", interval: "+2.102" },
                        { position: 3, driver: "NightFox", car: "BMW M4 GT3", interval: "+5.340" },
                    ],
                    full: [
                        { position: 1, driver: "Suki", car: "Mercedes AMG GT3", interval: "--" },
                        { position: 2, driver: "Ryo", car: "Porsche 911 GT3", interval: "+2.102" },
                        { position: 3, driver: "NightFox", car: "BMW M4 GT3", interval: "+5.340" },
                        { position: 4, driver: "Kai", car: "Audi R8 GT3", interval: "+9.130" },
                    ],
                },
            ],
        },
    ],
};

export const driversData = [
    {
        id: "nightfox",
        name: "NightFox",
        ir: 3850,
        sr: "A 4.52",
        bio: "GT3 领跑者 · 以稳定和策略著称",
        history: [
            "GT3 Open 25S2 冠军",
            "GT3 Open 26S1 当前积分领先",
        ],
    },
    {
        id: "mango",
        name: "Mango",
        ir: 2100,
        sr: "B 3.72",
        bio: "新手赛新人王 · 爬升速度最快",
        history: [
            "新手赛 26S1 当前积分第一",
            "首次登台：Round 2",
        ],
    },
    {
        id: "ryo",
        name: "Ryo",
        ir: 3450,
        sr: "A 3.98",
        bio: "节奏型车手 · 长距离稳定",
        history: [
            "GT3 Open 25S2 冠军",
            "GT3 Open 26S1 积分第二",
        ],
    },
];

export const profileData = {
    name: "You",
    tag: "CNA Member",
    ir: 2600,
    sr: "B 3.42",
    lastRace: "GT3 Open · Round 2",
    achievements: [
        "完成 8 场 CNA 官方赛事",
        "赛季最佳排名：P5",
        "安全评分提升 +0.34",
    ],
};

export const registrations = {
    gt3open: ["NightFox", "Ryo", "Suki", "Kai"],
    rookie: ["Mango", "Yuki", "Axel", "Luna"],
};
