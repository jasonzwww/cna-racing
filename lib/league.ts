import { leagueData, Race } from "@/data/league";

export function getNextRace(): Race | null {
    const now = new Date();

    const races = leagueData.races
        .map((r) => ({ ...r, _d: new Date(r.date + "T00:00:00") }))
        .sort((a, b) => a._d.getTime() - b._d.getTime());

    const found = races.find((r) => r._d.getTime() >= now.getTime());
    return found ?? (races[0] ?? null);
}
