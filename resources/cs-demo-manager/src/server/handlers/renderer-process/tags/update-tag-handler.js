import { updateTag } from 'csdm/node/database/tags/update-tag';
import { handleError } from '../../handle-error';
export async function updateTagHandler(tag) {
    try {
        await updateTag(tag);
    }
    catch (error) {
        handleError(error, 'Error while updating tag');
    }
}
//# sourceMappingURL=update-tag-handler.js.map