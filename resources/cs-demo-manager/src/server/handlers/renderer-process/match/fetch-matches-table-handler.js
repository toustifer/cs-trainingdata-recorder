import { fetchMatchesTable } from 'csdm/node/database/matches/fetch-matches-table';
import { handleError } from '../../handle-error';
export async function fetchMatchesTableHandler(payload) {
    try {
        const matches = await fetchMatchesTable(payload);
        return matches;
    }
    catch (error) {
        handleError(error, 'Error while fetching matches table');
    }
}
//# sourceMappingURL=fetch-matches-table-handler.js.map