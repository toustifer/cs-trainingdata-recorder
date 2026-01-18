import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { isCounterStrikeStartable, useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { Button } from 'csdm/ui/components/buttons/button';
import { CounterStrikeRunningDialog } from '../dialogs/counter-strike-running-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
export function WatchButton({ game, isDisabled, demoPath, tick, focusSteamId }) {
    const [isCheckingCsStatus, setIsCheckingForCsStatus] = useState(false);
    const { watchDemo, isKillCsRequired } = useCounterStrike();
    const { showDialog } = useDialog();
    const startWatchDemo = () => {
        if (demoPath === undefined) {
            return;
        }
        watchDemo({
            demoPath,
            startTick: tick,
            focusSteamId,
        });
    };
    const onClick = async (event) => {
        event.stopPropagation();
        setIsCheckingForCsStatus(true);
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            showDialog(React.createElement(CounterStrikeRunningDialog, { onConfirmClick: startWatchDemo }));
        }
        else {
            startWatchDemo();
        }
        setIsCheckingForCsStatus(false);
    };
    if (!isCounterStrikeStartable(game)) {
        return null;
    }
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled || demoPath === undefined || isCheckingCsStatus },
        React.createElement(Trans, { context: "Button" }, "Watch")));
}
//# sourceMappingURL=watch-button.js.map