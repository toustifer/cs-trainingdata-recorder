import React, { useId } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useSequenceForm } from './use-sequence-form';
export function EndTickInput() {
    const id = useId();
    const match = useCurrentMatch();
    const { t } = useLingui();
    const { sequence, updateSequence } = useSequenceForm();
    const onBlur = (event) => {
        const input = event.target;
        if (Number.isNaN(Number.parseInt(input.value))) {
            const roundedTickrate = Math.round(match.tickrate);
            const newEndTick = Number(sequence.startTick) + roundedTickrate;
            updateSequence({
                endTick: String(newEndTick),
            });
        }
    };
    const onChange = (event) => {
        const input = event.target;
        updateSequence({
            endTick: input.value,
        });
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "End tick")),
        React.createElement(InputNumber, { id: id, min: 1, placeholder: t({
                context: 'Input placeholder',
                message: 'End tick',
            }), value: sequence.endTick, onChange: onChange, onBlur: onBlur })));
}
//# sourceMappingURL=end-tick-input.js.map