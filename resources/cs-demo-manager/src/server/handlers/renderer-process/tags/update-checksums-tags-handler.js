import { updateChecksumsTags } from 'csdm/node/database/tags/update-checksums-tags';
import { handleError } from '../../handle-error';
export async function updateChecksumsTagsHandler({ checksums, tagIds }) {
    try {
        await updateChecksumsTags(checksums, tagIds);
    }
    catch (error) {
        handleError(error, 'Error while updating checksums tags');
    }
}
//# sourceMappingURL=update-checksums-tags-handler.js.map