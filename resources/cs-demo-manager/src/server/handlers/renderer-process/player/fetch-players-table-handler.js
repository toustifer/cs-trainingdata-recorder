import { fetchPlayersTable } from 'csdm/node/database/players/fetch-players-table';
import { handleError } from '../../handle-error';
export async function fetchPlayersHandler(filter) {
    try {
        const players = await fetchPlayersTable(filter);
        return players;
    }
    catch (error) {
        handleError(error, 'Error while fetching players table');
    }
}
//# sourceMappingURL=fetch-players-table-handler.js.map