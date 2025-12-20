import { normalizeName } from "@/lib/points";

/**
 * key = driver display_name (exact match recommended)
 * value = team name
 */
const RAW_DRIVER_TO_TEAM: Record<string, string> = {
    // Example:
    // "Zile Li": "Team Push",
    // "Alex Chen": "Steady Racing",
};

export const driverToTeam: Record<string, string> = Object.fromEntries(
    Object.entries(RAW_DRIVER_TO_TEAM).map(([k, v]) => [normalizeName(k), v])
);
