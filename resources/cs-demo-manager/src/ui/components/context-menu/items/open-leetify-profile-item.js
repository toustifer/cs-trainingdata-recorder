import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function OpenLeetifyProfileItem({ steamId }) {
    const onClick = () => {
        window.open(`https://leetify.com/app/profile/${steamId}`, '_blank');
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Open Leetify profile")));
}
//# sourceMappingURL=open-leetify-profile-item.js.map