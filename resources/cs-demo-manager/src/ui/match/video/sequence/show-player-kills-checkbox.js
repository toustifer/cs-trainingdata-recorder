import React from 'react';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { useSequenceForm } from './use-sequence-form';
export function ShowPlayerKillsCheckbox({ rowIndex }) {
    const { sequence, updateSequence } = useSequenceForm();
    const isChecked = sequence.playersOptions[rowIndex].showKill;
    const onChange = (event) => {
        const isChecked = event.target.checked;
        updateSequence({
            playersOptions: sequence.playersOptions.map((options, index) => {
                if (index === rowIndex) {
                    return {
                        ...options,
                        showKill: isChecked,
                    };
                }
                return options;
            }),
        });
    };
    return React.createElement(Checkbox, { onChange: onChange, isChecked: isChecked });
}
//# sourceMappingURL=show-player-kills-checkbox.js.map