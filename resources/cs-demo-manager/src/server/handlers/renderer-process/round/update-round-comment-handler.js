import { insertOrUpdateRoundComment } from 'csdm/node/database/comments/insert-or-update-round-comment';
import { handleError } from '../../handle-error';
export async function updateRoundCommentHandler({ checksum, number, comment }) {
    try {
        await insertOrUpdateRoundComment(checksum, number, comment);
    }
    catch (error) {
        handleError(error, `Error while updating round comment #${number} for match ${checksum}`);
    }
}
//# sourceMappingURL=update-round-comment-handler.js.map