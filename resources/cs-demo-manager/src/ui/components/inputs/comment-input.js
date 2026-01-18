import React from 'react';
import { useLingui } from '@lingui/react/macro';
import { MarkdownEditor } from './markdown-editor';
export function CommentInput({ isResizable, currentComment, updateComment }) {
    const { t } = useLingui();
    const onBlur = (comment) => {
        if (comment === currentComment) {
            return;
        }
        updateComment(comment);
    };
    return (React.createElement(MarkdownEditor, { defaultValue: currentComment, onBlur: onBlur, isResizable: isResizable, placeholder: t({
            context: 'Input placeholder',
            message: 'Comment (Markdown supported)',
        }) }));
}
//# sourceMappingURL=comment-input.js.map