import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from 'csdm/ui/dialogs/dialog';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ConfirmButton } from 'csdm/ui/components/buttons/confirm-button';
export function SelectSecondsDialog({ onSubmit, tick, operation }) {
    const [seconds, setSeconds] = useState('');
    const { hideDialog } = useDialog();
    const match = useCurrentMatch();
    const submit = () => {
        const secondsAsNumber = Number(seconds);
        const ticks = secondsAsNumber * match.tickrate;
        const newTick = operation === 'minus' ? tick - ticks : tick + ticks;
        const isValidTick = newTick > 0 && newTick < match.tickCount;
        if (isValidTick) {
            onSubmit(newTick);
        }
        hideDialog();
    };
    return (React.createElement(Dialog, { onEnterPressed: submit },
        React.createElement(DialogHeader, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Dialog title" }, "Enter the number of seconds"))),
        React.createElement(DialogContent, null,
            React.createElement(InputNumber, { defaultValue: seconds, focusOnMount: true, onChange: (event) => {
                    setSeconds(event.target.value);
                }, placeholder: "10" })),
        React.createElement(DialogFooter, null,
            React.createElement(ConfirmButton, { onClick: submit }),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=select-seconds-dialog.js.map