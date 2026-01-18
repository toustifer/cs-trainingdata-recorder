import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { isCounterStrikeStartable } from 'csdm/ui/hooks/use-counter-strike';
import { useCurrentMatch } from '../../use-current-match';
import { useNavigateToMatchPlayer } from 'csdm/ui/hooks/navigation/use-navigate-to-match-player';
import { AddToVideoSequencesItem } from 'csdm/ui/components/context-menu/items/add-to-video-sequences-item';
export function OpeningDuelContextMenu({ kill, onWatchClick }) {
    const match = useCurrentMatch();
    const navigateToMatchPlayer = useNavigateToMatchPlayer();
    return (React.createElement(ContextMenu, null,
        isCounterStrikeStartable(match.game) && (React.createElement(ContextMenuItem, { onClick: () => {
                onWatchClick(kill);
            } }, React.createElement(Trans, { context: "Context menu" }, "Watch"))),
        kill.killerSteamId !== '0' && (React.createElement(ContextMenuItem, { onClick: () => {
                navigateToMatchPlayer(match.checksum, kill.killerSteamId);
            } }, React.createElement(Trans, { context: "Context menu" }, "See killer details"))),
        kill.victimSteamId !== '0' && (React.createElement(ContextMenuItem, { onClick: () => {
                navigateToMatchPlayer(match.checksum, kill.victimSteamId);
            } }, React.createElement(Trans, { context: "Context menu" }, "See victim details"))),
        React.createElement(AddToVideoSequencesItem, { startTick: kill.tick - Math.round(match.tickrate * 5), endTick: kill.tick + Math.round(match.tickrate * 2), playerFocusSteamId: kill.killerSteamId, playerFocusName: kill.killerName })));
}
//# sourceMappingURL=opening-duel-context-menu.js.map