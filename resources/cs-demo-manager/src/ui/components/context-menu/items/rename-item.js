import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { ContextMenuItem } from '../context-menu-item';
export function RenameItem({ onClick }) {
    const { t } = useLingui();
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Context menu" }, "Rename")),
        React.createElement("p", { className: "text-caption" }, window.csdm.isMac
            ? t({
                context: 'Keyboard shortcut',
                message: 'Enter',
            })
            : 'F2')));
}
//# sourceMappingURL=rename-item.js.map