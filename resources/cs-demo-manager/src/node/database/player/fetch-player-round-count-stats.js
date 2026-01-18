import {} from '../match/apply-match-filters';
import { fetchPlayersRoundCountStats } from '../players/fetch-players-round-count-stats';
export async function fetchPlayerRoundCountStats(steamId, filters) {
    const rows = await fetchPlayersRoundCountStats([steamId], filters);
    if (rows.length === 0) {
        return {
            steamId,
            totalCount: 0,
            roundCountAsCt: 0,
            roundCountAsT: 0,
        };
    }
    return rows[0];
}
//# sourceMappingURL=fetch-player-round-count-stats.js.map