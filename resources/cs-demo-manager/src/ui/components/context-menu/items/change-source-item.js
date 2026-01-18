import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from '../context-menu-item';
export function ChangeSourceItem({ onClick }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Change source")));
}
//# sourceMappingURL=change-source-item.js.map