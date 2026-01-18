import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { isCounterStrikeStartable, useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { CounterStrikeRunningDialog } from 'csdm/ui/components/dialogs/counter-strike-running-dialog';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
function WatchAtTickDialog() {
    const { t } = useLingui();
    const [tick, setTick] = useState('');
    const [isCsRunningDialogVisible, setIsCsRunningDialogVisible] = useState(false);
    const { watchDemo, isKillCsRequired } = useCounterStrike();
    const match = useCurrentMatch();
    const { hideDialog } = useDialog();
    const startWatchDemo = () => {
        watchDemo({
            demoPath: match.demoFilePath,
            startTick: Number(tick),
        });
        hideDialog();
    };
    const onSubmit = async () => {
        const isTickValid = tick !== '';
        if (!isTickValid) {
            return;
        }
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            setIsCsRunningDialogVisible(true);
        }
        else {
            startWatchDemo();
        }
    };
    if (isCsRunningDialogVisible) {
        const onConfirmClick = () => {
            startWatchDemo();
        };
        return React.createElement(CounterStrikeRunningDialog, { onConfirmClick: onConfirmClick });
    }
    return (React.createElement(Dialog, { onEnterPressed: onSubmit },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Watch at tick"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "The playback will start at the specified tick.")),
                React.createElement(InputNumber, { defaultValue: tick, focusOnMount: true, onChange: (event) => {
                        const value = event.target.value;
                        setTick(value);
                    }, placeholder: t `Tick` }))),
        React.createElement(DialogFooter, null,
            React.createElement(Button, { onClick: onSubmit, variant: ButtonVariant.Primary },
                React.createElement(Trans, { context: "Button" }, "Watch")),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
export function WatchMatchAtTickButton() {
    const { showDialog } = useDialog();
    const match = useCurrentMatch();
    const onClick = () => {
        showDialog(React.createElement(WatchAtTickDialog, null));
    };
    if (!isCounterStrikeStartable(match.game)) {
        return null;
    }
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Watch at tick")));
}
//# sourceMappingURL=watch-match-at-tick-button.js.map