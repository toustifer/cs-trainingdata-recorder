import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { buildPlayerSteamProfileUrl } from 'csdm/ui/shared/build-player-steam-profile-url';
export function OpenSteamProfileItem({ steamIds }) {
    const onClick = () => {
        for (const steamId of steamIds.slice(0, 10)) {
            window.open(buildPlayerSteamProfileUrl(steamId), '_blank');
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Open Steam community profile")));
}
//# sourceMappingURL=open-steam-profile-item.js.map