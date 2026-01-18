import React from 'react';
import { Trans } from '@lingui/react/macro';
import { decodeCrosshairShareCode, crosshairToConVars, InvalidCrosshairShareCode } from 'csgo-sharecode';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { useClipboard } from 'csdm/ui/hooks/use-clipboard';
export function CopyCrosshairConfig({ steamId }) {
    const match = useCurrentMatch();
    const showToast = useShowToast();
    const { copyToClipboard } = useClipboard();
    const player = match.players.find((player) => {
        return player.steamId === steamId;
    });
    if (player === undefined) {
        return null;
    }
    const crosshairShareCode = player.crosshairShareCode;
    if (crosshairShareCode === null) {
        return null;
    }
    const onClick = () => {
        try {
            const crosshair = decodeCrosshairShareCode(crosshairShareCode);
            const config = crosshairToConVars(crosshair);
            copyToClipboard(config);
        }
        catch (error) {
            const message = error instanceof InvalidCrosshairShareCode ? (React.createElement(Trans, null, "Invalid crosshair share code")) : (React.createElement(Trans, null, "An error occurred"));
            showToast({
                content: message,
                id: 'copy-crosshair-config-error',
                type: 'error',
            });
            logger.error('Failed to copy crosshair config');
            logger.error(error);
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu sub item" }, "Crosshair config")));
}
//# sourceMappingURL=copy-crosshair-config-item.js.map