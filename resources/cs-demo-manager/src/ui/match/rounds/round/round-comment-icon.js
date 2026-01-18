import React from 'react';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { CommentDotsIcon } from 'csdm/ui/icons/comment-dots-icon';
import { Markdown } from 'csdm/ui/components/markdown';
export function RoundCommentIcon({ comment }) {
    return (React.createElement(Tooltip, { content: React.createElement("div", { className: "max-h-[400px] overflow-hidden" },
            React.createElement(Markdown, { markdown: comment })) },
        React.createElement(CommentDotsIcon, { className: "size-16" })));
}
//# sourceMappingURL=round-comment-icon.js.map