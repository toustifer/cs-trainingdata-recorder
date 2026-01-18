import { updateDemosType } from 'csdm/node/database/demos/update-demos-type';
import { handleError } from '../../handle-error';
export async function updateDemosTypeHandler({ checksums, type }) {
    try {
        await updateDemosType(checksums, type);
    }
    catch (error) {
        handleError(error, 'Error while updating demos type');
    }
}
//# sourceMappingURL=update-demos-type-handler.js.map