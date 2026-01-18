import { searchPlayers } from 'csdm/node/database/search/search-players';
import { handleError } from '../../handle-error';
export async function searchPlayersHandler(filter) {
    try {
        const players = await searchPlayers(filter);
        return players;
    }
    catch (error) {
        handleError(error, 'Error while searching players');
    }
}
//# sourceMappingURL=search-players-handler.js.map