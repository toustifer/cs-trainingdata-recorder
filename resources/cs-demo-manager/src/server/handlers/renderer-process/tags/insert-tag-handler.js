import { insertTag } from 'csdm/node/database/tags/insert-tag';
import { handleError } from '../../handle-error';
export async function insertTagHandler(tag) {
    try {
        const newTag = await insertTag(tag);
        return newTag;
    }
    catch (error) {
        handleError(error, 'Error while inserting tag');
    }
}
//# sourceMappingURL=insert-tag-handler.js.map