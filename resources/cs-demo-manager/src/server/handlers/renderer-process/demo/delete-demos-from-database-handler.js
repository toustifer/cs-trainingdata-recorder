import { deleteDemos } from 'csdm/node/database/demos/delete-demos';
import { handleError } from '../../handle-error';
export async function deleteDemosFromDatabaseHandler(checksums) {
    try {
        await deleteDemos(checksums);
    }
    catch (error) {
        handleError(error, 'Error while deleting demos from database');
    }
}
//# sourceMappingURL=delete-demos-from-database-handler.js.map