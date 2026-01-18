import { handleError } from '../../handle-error';
import { fetchLast5EPlayMatches } from 'csdm/node/5eplay/fetch-last-5eplay-matches';
export async function fetchLast5EPlayMatchesHandler(accountId) {
    try {
        const matches = await fetchLast5EPlayMatches(accountId);
        return matches;
    }
    catch (error) {
        handleError(error, 'Error while fetching last 5Eplay matches');
    }
}
//# sourceMappingURL=fetch-last-5eplay-matches-handler.js.map