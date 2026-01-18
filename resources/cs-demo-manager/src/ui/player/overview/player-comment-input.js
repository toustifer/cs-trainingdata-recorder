import React from 'react';
import { usePlayer } from '../use-player';
import { useUpdatePlayerComment } from '../use-update-player-comment';
import { CommentInput } from 'csdm/ui/components/inputs/comment-input';
export function PlayerCommentInput() {
    const updateComment = useUpdatePlayerComment();
    const player = usePlayer();
    return (React.createElement(CommentInput, { isResizable: true, currentComment: player.comment, updateComment: (comment) => {
            updateComment({
                steamId: player.steamId,
                comment,
            });
        } }));
}
//# sourceMappingURL=player-comment-input.js.map