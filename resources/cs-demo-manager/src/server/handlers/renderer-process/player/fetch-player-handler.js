import { fetchPlayerProfile } from 'csdm/node/database/player/fetch-player-profile';
import { handleError } from '../../handle-error';
export async function fetchPlayerHandler(payload) {
    try {
        const player = await fetchPlayerProfile(payload.steamId, payload);
        return player;
    }
    catch (error) {
        handleError(error, `Error while fetching player with steamID ${payload.steamId}`);
    }
}
//# sourceMappingURL=fetch-player-handler.js.map