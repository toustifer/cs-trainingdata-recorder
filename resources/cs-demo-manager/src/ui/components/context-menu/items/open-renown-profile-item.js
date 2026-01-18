import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function OpenRenownProfileItem({ steamId }) {
    const onClick = () => {
        window.open(`https://renown.gg/profile/${steamId}`, '_blank');
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Open Renown profile")));
}
//# sourceMappingURL=open-renown-profile-item.js.map