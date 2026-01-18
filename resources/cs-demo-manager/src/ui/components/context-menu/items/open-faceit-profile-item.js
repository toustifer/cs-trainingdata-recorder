import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function OpenFaceitProfileItem({ nickname }) {
    const onClick = () => {
        window.open(`https://www.faceit.com/en/players/${nickname}`, '_blank');
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Open FACEIT profile")));
}
//# sourceMappingURL=open-faceit-profile-item.js.map