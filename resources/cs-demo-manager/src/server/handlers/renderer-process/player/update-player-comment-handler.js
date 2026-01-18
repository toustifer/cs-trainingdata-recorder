import { handleError } from '../../handle-error';
import { insertOrUpdatePlayerComment } from 'csdm/node/database/comments/insert-or-update-player-comment';
export async function updatePlayerCommentHandler({ steamId, comment }) {
    try {
        await insertOrUpdatePlayerComment(steamId, comment);
    }
    catch (error) {
        handleError(error, `Error while updating player comment with steamID ${steamId}`);
    }
}
//# sourceMappingURL=update-player-comment-handler.js.map