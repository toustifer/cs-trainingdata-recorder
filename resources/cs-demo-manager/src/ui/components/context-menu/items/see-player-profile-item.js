import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useNavigateToPlayer } from 'csdm/ui/hooks/use-navigate-to-player';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function SeePlayerProfileItem({ steamId }) {
    const navigateToPlayer = useNavigateToPlayer();
    const onClick = () => {
        navigateToPlayer(steamId);
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "See profile")));
}
//# sourceMappingURL=see-player-profile-item.js.map