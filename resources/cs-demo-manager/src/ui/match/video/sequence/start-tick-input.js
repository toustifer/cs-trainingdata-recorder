import React, { useId } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useSequenceForm } from './use-sequence-form';
export function StartTickInput() {
    const id = useId();
    const { t } = useLingui();
    const { sequence, updateSequence } = useSequenceForm();
    const onBlur = (event) => {
        const input = event.target;
        if (Number.isNaN(Number.parseInt(input.value))) {
            updateSequence({
                startTick: '1',
            });
        }
    };
    const onChange = (event) => {
        const input = event.target;
        updateSequence({
            startTick: input.value,
        });
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "Start tick")),
        React.createElement(InputNumber, { id: id, min: 1, placeholder: t({
                context: 'Input placeholder',
                message: 'Start tick',
            }), value: sequence.startTick, onChange: onChange, onBlur: onBlur })));
}
//# sourceMappingURL=start-tick-input.js.map