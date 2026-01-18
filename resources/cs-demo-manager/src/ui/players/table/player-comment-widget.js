import React from 'react';
import { TableCommentWidget } from 'csdm/ui/components/table/comment-widget';
import { useUpdatePlayerComment } from 'csdm/ui/player/use-update-player-comment';
export function PlayerCommentWidget({ onClose, players }) {
    const updateComment = useUpdatePlayerComment();
    if (players.length === 0) {
        return null;
    }
    const selectedPlayer = players[0];
    const onBlur = (comment) => {
        if (comment === selectedPlayer.comment) {
            return;
        }
        updateComment({
            steamId: selectedPlayer.steamId,
            comment,
        });
    };
    return (React.createElement(TableCommentWidget, { key: `comment-${selectedPlayer.steamId}`, comment: selectedPlayer.comment, onClose: onClose, onBlur: onBlur }));
}
//# sourceMappingURL=player-comment-widget.js.map