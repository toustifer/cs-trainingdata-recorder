import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function DetailsItem({ onClick }) {
    const { t } = useLingui();
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Context menu" }, "Details")),
        React.createElement("p", { className: "text-caption" }, window.csdm.isMac
            ? '⌘+↓'
            : t({
                context: 'Keyboard shortcut',
                message: 'Enter',
            }))));
}
//# sourceMappingURL=details-item.js.map