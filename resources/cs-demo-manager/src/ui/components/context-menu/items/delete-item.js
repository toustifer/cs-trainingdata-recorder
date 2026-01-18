import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from '../context-menu-item';
export function DeleteItem({ onClick }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Context menu" }, "Delete")),
        React.createElement("p", { className: "text-caption" }, "\u27F5")));
}
//# sourceMappingURL=delete-item.js.map