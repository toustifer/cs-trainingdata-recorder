import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { CounterStrikeRunningDialog } from 'csdm/ui/components/dialogs/counter-strike-running-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
export function WatchItem({ demoPath }) {
    const { watchDemo, isKillCsRequired } = useCounterStrike();
    const { showDialog } = useDialog();
    const startWatchDemo = () => {
        watchDemo({
            demoPath,
        });
    };
    const onClick = async () => {
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            showDialog(React.createElement(CounterStrikeRunningDialog, { onConfirmClick: startWatchDemo }));
        }
        else {
            startWatchDemo();
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Watch")));
}
//# sourceMappingURL=watch-item.js.map