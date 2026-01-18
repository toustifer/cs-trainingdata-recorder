import { fetchTeamsTable } from 'csdm/node/database/teams/fetch-teams-table';
import { handleError } from '../../handle-error';
export async function fetchTeamsTableHandler(filter) {
    try {
        const teams = await fetchTeamsTable(filter);
        return teams;
    }
    catch (error) {
        handleError(error, 'Error while fetching teams table');
    }
}
//# sourceMappingURL=fetch-teams-table-handler.js.map