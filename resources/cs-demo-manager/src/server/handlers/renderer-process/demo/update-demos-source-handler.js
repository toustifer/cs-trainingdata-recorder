import { updateDemosSource } from 'csdm/node/database/demos/update-demos-source';
import { handleError } from 'csdm/server/handlers/handle-error';
export async function updateDemosSourceHandler({ checksums, source }) {
    try {
        await updateDemosSource(checksums, source);
    }
    catch (error) {
        handleError(error, 'Error while updating demos source');
    }
}
//# sourceMappingURL=update-demos-source-handler.js.map