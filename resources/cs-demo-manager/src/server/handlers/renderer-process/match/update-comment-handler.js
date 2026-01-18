import { insertOrUpdateComment } from 'csdm/node/database/comments/insert-or-update-comment';
import { handleError } from '../../handle-error';
export async function updateCommentHandler({ checksum, comment }) {
    try {
        await insertOrUpdateComment(checksum, comment);
    }
    catch (error) {
        handleError(error, `Error while updating comment with checksum ${checksum}`);
    }
}
//# sourceMappingURL=update-comment-handler.js.map