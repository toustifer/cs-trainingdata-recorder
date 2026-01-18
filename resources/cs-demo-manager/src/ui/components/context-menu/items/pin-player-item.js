import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useUpdateSettings } from 'csdm/ui/settings/use-update-settings';
import { ContextMenuItem } from '../context-menu-item';
export function PinPlayerItem({ steamId }) {
    const updateSettings = useUpdateSettings();
    const onClick = () => {
        updateSettings({
            pinnedPlayerSteamId: steamId,
        });
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Pin this player")));
}
//# sourceMappingURL=pin-player-item.js.map