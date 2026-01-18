import {} from '../match/apply-match-filters';
import { fetchPlayersMapsStats } from '../players/fetch-players-maps-stats';
export function fetchPlayerMapsStats(steamId, filters) {
    return fetchPlayersMapsStats([steamId], filters);
}
//# sourceMappingURL=fetch-player-maps-stats.js.map