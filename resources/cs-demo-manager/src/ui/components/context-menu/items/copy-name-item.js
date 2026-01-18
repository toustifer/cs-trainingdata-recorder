import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useClipboard } from 'csdm/ui/hooks/use-clipboard';
export function CopyNameItem({ names }) {
    const { copyToClipboard } = useClipboard();
    const onClick = () => {
        copyToClipboard(names.join(','));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Copy name")));
}
//# sourceMappingURL=copy-name-item.js.map