import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useClipboard } from 'csdm/ui/hooks/use-clipboard';
export function CopySteamIdItem({ steamIds, children }) {
    const { copyToClipboard } = useClipboard();
    const onClick = () => {
        copyToClipboard(steamIds.join(','));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick }, children ? children : React.createElement(Trans, { context: "Context menu" }, "Copy Steam ID")));
}
//# sourceMappingURL=copy-steamid-item.js.map