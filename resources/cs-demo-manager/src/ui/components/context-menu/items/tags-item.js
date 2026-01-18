import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function TagsItem({ onClick }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Context menu" }, "Tags")),
        React.createElement("p", { className: "text-caption" }, "T")));
}
//# sourceMappingURL=tags-item.js.map