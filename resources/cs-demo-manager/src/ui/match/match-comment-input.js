import React from 'react';
import { useCurrentMatch } from './use-current-match';
import { useUpdateComment } from 'csdm/ui/comment/use-update-comment';
import { CommentInput } from '../components/inputs/comment-input';
export function MatchCommentInput({ isResizable = false }) {
    const match = useCurrentMatch();
    const updateComment = useUpdateComment();
    return (React.createElement(CommentInput, { isResizable: isResizable, currentComment: match.comment, updateComment: (comment) => {
            updateComment({
                checksum: match.checksum,
                comment,
            });
        } }));
}
//# sourceMappingURL=match-comment-input.js.map