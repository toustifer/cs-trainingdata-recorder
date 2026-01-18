import React from 'react';
import { CommentInput } from 'csdm/ui/components/inputs/comment-input';
import { useUpdateRoundComment } from './use-update-round-comment';
export function RoundCommentInput({ checksum, number, comment }) {
    const updateComment = useUpdateRoundComment();
    return (React.createElement(CommentInput, { currentComment: comment, updateComment: (comment) => {
            updateComment({
                checksum,
                number,
                comment,
            });
        } }));
}
//# sourceMappingURL=round-comment-input.js.map