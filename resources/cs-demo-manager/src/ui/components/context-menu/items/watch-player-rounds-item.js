import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useDialog } from '../../dialogs/use-dialog';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { CounterStrikeRunningDialog } from '../../dialogs/counter-strike-running-dialog';
export function WatchPlayerRoundsItem({ demoPath, steamId }) {
    const { showDialog } = useDialog();
    const { isKillCsRequired, watchPlayerRounds } = useCounterStrike();
    const startPlayback = () => {
        watchPlayerRounds({
            demoPath,
            steamId,
        });
    };
    const onClick = async () => {
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            showDialog(React.createElement(CounterStrikeRunningDialog, { closeOnConfirm: false, onConfirmClick: startPlayback }));
        }
        else {
            startPlayback();
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu watch player rounds" }, "Rounds")));
}
//# sourceMappingURL=watch-player-rounds-item.js.map