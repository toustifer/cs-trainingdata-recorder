import {} from '../match/apply-match-filters';
import { fetchPlayersUtilityStats } from '../players/fetch-players-utility-stats';
export async function fetchPlayerUtilityStats(steamId, filters) {
    const stats = await fetchPlayersUtilityStats([steamId], filters);
    if (stats.length === 0) {
        return {
            steamId,
            averageBlindTime: 0,
            averageEnemiesFlashed: 0,
            averageHeGrenadeDamage: 0,
            averageSmokesThrownPerMatch: 0,
        };
    }
    return stats[0];
}
//# sourceMappingURL=fetch-player-utility-stats.js.map