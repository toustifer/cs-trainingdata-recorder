import React from 'react';
import { Trans } from '@lingui/react/macro';
import { MarkdownEditor } from 'csdm/ui/components/inputs/markdown-editor';
import { useUpdateComment } from 'csdm/ui/comment/use-update-comment';
export function DemoCommentInput({ checksum, currentComment }) {
    const updateComment = useUpdateComment();
    const onBlur = (comment) => {
        if (comment === currentComment) {
            return;
        }
        updateComment({
            checksum,
            comment,
        });
    };
    return (React.createElement("div", { className: "flex h-fit flex-col gap-y-8" },
        React.createElement("label", { htmlFor: "comment" },
            React.createElement(Trans, null, "Comment:")),
        React.createElement("div", { className: "max-h-[120px]" },
            React.createElement(MarkdownEditor, { defaultValue: currentComment, onBlur: onBlur }))));
}
//# sourceMappingURL=demo-comment-input.js.map