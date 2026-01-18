import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useDialog } from '../../dialogs/use-dialog';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { usePlaybackSettings } from 'csdm/ui/settings/playback/use-playback-settings';
import { SelectActionsPovDialog } from '../../dialogs/select-actions-pov-dialog';
import { WatchType } from 'csdm/common/types/watch-type';
import { Perspective } from 'csdm/common/types/perspective';
import { CounterStrikeRunningDialog } from '../../dialogs/counter-strike-running-dialog';
import { Game } from 'csdm/common/types/counter-strike';
export function WatchPlayerHighlightsItem({ demoPath, steamId, game }) {
    const { showDialog } = useDialog();
    const { isKillCsRequired, watchPlayerHighlights } = useCounterStrike();
    const { useCustomHighlights } = usePlaybackSettings();
    const startPlayerHighlights = () => {
        if (useCustomHighlights || game !== Game.CSGO) {
            showDialog(React.createElement(SelectActionsPovDialog, { demoPath: demoPath, playerSteamId: steamId, type: WatchType.Highlights }));
        }
        else {
            watchPlayerHighlights({
                demoPath,
                steamId,
                perspective: Perspective.Player,
            });
        }
    };
    const onClick = async () => {
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            showDialog(React.createElement(CounterStrikeRunningDialog, { closeOnConfirm: false, onConfirmClick: startPlayerHighlights }));
        }
        else {
            startPlayerHighlights();
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu watch player highlights" }, "Highlights")));
}
//# sourceMappingURL=watch-player-highlights-item.js.map