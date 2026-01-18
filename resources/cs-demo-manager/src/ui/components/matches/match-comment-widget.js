import React from 'react';
import { TableCommentWidget } from 'csdm/ui/components/table/comment-widget';
import { useUpdateComment } from 'csdm/ui/comment/use-update-comment';
export function MatchCommentWidget({ onClose, matches }) {
    const updateComment = useUpdateComment();
    if (matches.length === 0) {
        return null;
    }
    const selectedMatch = matches[0];
    const onBlur = (comment) => {
        if (comment === selectedMatch.comment) {
            return;
        }
        updateComment({
            checksum: selectedMatch.checksum,
            comment,
        });
    };
    return (React.createElement(TableCommentWidget, { key: `comment-${selectedMatch.checksum}`, comment: selectedMatch.comment, onClose: onClose, onBlur: onBlur }));
}
//# sourceMappingURL=match-comment-widget.js.map