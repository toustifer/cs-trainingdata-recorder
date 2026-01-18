import { fetchLastFaceitMatches } from 'csdm/node/faceit/fetch-last-faceit-matches';
import { handleError } from '../../handle-error';
export async function fetchLastFaceitMatchesHandler(accountId) {
    try {
        const matches = await fetchLastFaceitMatches(accountId);
        return matches;
    }
    catch (error) {
        handleError(error, 'Error while fetching last FACEIT matches');
    }
}
//# sourceMappingURL=fetch-last-faceit-matches-handler.js.map