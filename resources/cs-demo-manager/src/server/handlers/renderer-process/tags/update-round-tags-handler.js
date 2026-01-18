import { handleError } from 'csdm/server/handlers/handle-error';
import { updateRoundTags } from 'csdm/node/database/tags/update-round-tags';
export async function updateRoundTagsHandler({ checksum, roundNumber, tagIds }) {
    try {
        await updateRoundTags(checksum, roundNumber, tagIds);
    }
    catch (error) {
        handleError(error, 'Error while updating round tags');
    }
}
//# sourceMappingURL=update-round-tags-handler.js.map