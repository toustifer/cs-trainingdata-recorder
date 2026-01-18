import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function CopyShareCodeItem({ shareCodes }) {
    const onClick = () => {
        navigator.clipboard.writeText(shareCodes.join('\n'));
    };
    const isDisabled = shareCodes.includes('');
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Copy context menu" }, "Share code")));
}
//# sourceMappingURL=copy-sharecode-item.js.map