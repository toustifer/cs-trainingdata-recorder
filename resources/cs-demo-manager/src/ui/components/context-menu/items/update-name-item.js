import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from '../context-menu-item';
export function UpdateNameItem({ onClick }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Update name")));
}
//# sourceMappingURL=update-name-item.js.map