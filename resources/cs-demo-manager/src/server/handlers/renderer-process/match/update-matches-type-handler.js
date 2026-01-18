import { updateMatchesType } from 'csdm/node/database/matches/update-matches-type';
import { handleError } from '../../handle-error';
export async function updateMatchesTypeHandler({ checksums, type }) {
    try {
        await updateMatchesType(checksums, type);
    }
    catch (error) {
        handleError(error, 'Error while updating matches type');
    }
}
//# sourceMappingURL=update-matches-type-handler.js.map