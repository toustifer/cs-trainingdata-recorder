import React from 'react';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { usePlayersOptions } from './use-players-options';
export function ShowPlayerKillsCheckbox({ rowIndex }) {
    const { options, update } = usePlayersOptions();
    const isChecked = options[rowIndex].showKill;
    const onChange = (event) => {
        const isChecked = event.target.checked;
        update(options.map((options, index) => {
            if (index === rowIndex) {
                return {
                    ...options,
                    showKill: isChecked,
                };
            }
            return options;
        }));
    };
    return React.createElement(Checkbox, { onChange: onChange, isChecked: isChecked });
}
//# sourceMappingURL=show-player-kills-checkbox.js.map