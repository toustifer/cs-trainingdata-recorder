import { updatePlayersTags } from 'csdm/node/database/tags/update-players-tags';
import { handleError } from 'csdm/server/handlers/handle-error';
export async function updatePlayersTagsHandler({ steamIds, tagIds }) {
    try {
        await updatePlayersTags(steamIds, tagIds);
    }
    catch (error) {
        handleError(error, 'Error while updating players tags');
    }
}
//# sourceMappingURL=update-players-tags-handler.js.map