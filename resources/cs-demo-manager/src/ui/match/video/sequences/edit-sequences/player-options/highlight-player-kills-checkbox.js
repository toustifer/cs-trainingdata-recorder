import React from 'react';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { usePlayersOptions } from './use-players-options';
export function HighlightPlayerKillsCheckbox({ rowIndex }) {
    const { options, update } = usePlayersOptions();
    const isChecked = options[rowIndex].highlightKill;
    const onChange = (event) => {
        const isChecked = event.target.checked;
        update(options.map((options, index) => {
            if (index === rowIndex) {
                return {
                    ...options,
                    highlightKill: isChecked,
                };
            }
            return options;
        }));
    };
    return React.createElement(Checkbox, { onChange: onChange, isChecked: isChecked });
}
//# sourceMappingURL=highlight-player-kills-checkbox.js.map