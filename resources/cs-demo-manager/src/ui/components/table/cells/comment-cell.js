import React from 'react';
import { CommentDotsIcon } from 'csdm/ui/icons/comment-dots-icon';
import { Tooltip } from '../../tooltip';
import { MarkdownEditor } from '../../inputs/markdown-editor';
export function CommentCell({ data }) {
    const { comment } = data;
    if (comment === undefined || comment === '') {
        return null;
    }
    return (React.createElement(Tooltip, { delay: 0, content: React.createElement(MarkdownEditor, { defaultValue: comment }) },
        React.createElement(CommentDotsIcon, { width: 12, height: 12 })));
}
//# sourceMappingURL=comment-cell.js.map