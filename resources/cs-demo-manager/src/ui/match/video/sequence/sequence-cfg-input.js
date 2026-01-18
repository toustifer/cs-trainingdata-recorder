import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useSequenceForm } from './use-sequence-form';
import { CfgInput } from '../cfg-input';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
export function SequenceCfgInput() {
    const { sequence, updateSequence } = useSequenceForm();
    const onBlur = (event) => {
        const input = event.target;
        updateSequence({
            cfg: input.value,
        });
    };
    return (React.createElement("div", { className: "flex w-[300px] flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: "cfg" },
            React.createElement(Trans, { context: "Input label" }, "CFG")),
        React.createElement(CfgInput, { cfg: sequence.cfg, onBlur: onBlur })));
}
//# sourceMappingURL=sequence-cfg-input.js.map