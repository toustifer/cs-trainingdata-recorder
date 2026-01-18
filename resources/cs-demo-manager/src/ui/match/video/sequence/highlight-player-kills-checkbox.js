import React from 'react';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { useSequenceForm } from './use-sequence-form';
export function HighlightPlayerKillsCheckbox({ rowIndex }) {
    const { sequence, updateSequence } = useSequenceForm();
    const isChecked = sequence.playersOptions[rowIndex].highlightKill;
    const onChange = (event) => {
        const isChecked = event.target.checked;
        updateSequence({
            playersOptions: sequence.playersOptions.map((options, index) => {
                if (index === rowIndex) {
                    return {
                        ...options,
                        highlightKill: isChecked,
                    };
                }
                return options;
            }),
        });
    };
    return React.createElement(Checkbox, { onChange: onChange, isChecked: isChecked });
}
//# sourceMappingURL=highlight-player-kills-checkbox.js.map