export type PointsConfig = {
    // pointsByPos[1] = P1 points, pointsByPos[2] = P2 points ...
    pointsByPos: number[];
    fastestLapBonus?: number; // optional (not used by default)
    dnfGetsPoints?: boolean; // if false, DNF (laps_complete=0 or reason_out) gets 0
};

export const defaultPoints: PointsConfig = {
    // GT-style simple table (edit freely)
    // pos:  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15
    pointsByPos: [0, 25, 20, 16, 13, 11, 10,  9,  8,  7,  6,  5,  4,  3,  2,  1],
    fastestLapBonus: 0,
    dnfGetsPoints: true,
};

export function pointsForPosition(pos1Based: number, cfg: PointsConfig) {
    if (!Number.isFinite(pos1Based) || pos1Based <= 0) return 0;
    return cfg.pointsByPos[pos1Based] ?? 0;
}

export function normalizeName(name?: string) {
    return String(name ?? "")
        .trim()
        .replace(/\s+/g, " ");
}
