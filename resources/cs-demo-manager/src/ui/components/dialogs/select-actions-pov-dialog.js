import React from 'react';
import { Perspective } from 'csdm/common/types/perspective';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { WatchType } from 'csdm/common/types/watch-type';
import { SelectPovDialog } from './select-pov-dialog';
export function SelectActionsPovDialog({ playerSteamId, demoPath, type }) {
    const { watchPlayerHighlights, watchPlayerLowlights } = useCounterStrike();
    const { hideDialog } = useDialog();
    const startGame = (perspective) => {
        if (type === WatchType.Highlights) {
            watchPlayerHighlights({
                demoPath,
                steamId: playerSteamId,
                perspective,
            });
        }
        else {
            watchPlayerLowlights({
                demoPath,
                steamId: playerSteamId,
                perspective,
            });
        }
        hideDialog();
    };
    const onEnemyPovClick = () => {
        startGame(Perspective.Enemy);
    };
    const onPlayerPovClick = () => {
        startGame(Perspective.Player);
    };
    return React.createElement(SelectPovDialog, { onEnemyClick: onEnemyPovClick, onPlayerClick: onPlayerPovClick });
}
//# sourceMappingURL=select-actions-pov-dialog.js.map