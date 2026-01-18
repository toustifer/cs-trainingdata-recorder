import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from '../context-menu-item';
import { showCommentKey } from 'csdm/ui/keyboard/keyboard-shortcut';
export function CommentItem({ onClick, isDisabled = false }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: isDisabled },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Context menu" }, "Comment")),
        React.createElement("p", { className: "text-caption" }, showCommentKey)));
}
//# sourceMappingURL=comment-item.js.map