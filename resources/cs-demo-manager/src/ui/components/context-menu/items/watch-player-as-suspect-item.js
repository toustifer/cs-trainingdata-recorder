import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useDialog } from '../../dialogs/use-dialog';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { CounterStrikeRunningDialog } from '../../dialogs/counter-strike-running-dialog';
export function WatchPlayerAsSuspectItem({ demoPath, steamId }) {
    const { showDialog } = useDialog();
    const { isKillCsRequired, watchPlayerAsSuspect } = useCounterStrike();
    const startWatching = () => {
        watchPlayerAsSuspect({
            demoPath,
            steamId,
        });
    };
    const onClick = async () => {
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            showDialog(React.createElement(CounterStrikeRunningDialog, { onConfirmClick: startWatching }));
        }
        else {
            startWatching();
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu to watch a player as a suspect" }, "As a suspect")));
}
//# sourceMappingURL=watch-player-as-suspect-item.js.map