import React from 'react';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { usePlayersOptions } from './use-players-options';
export function EnablePlayerVoicesCheckbox({ rowIndex }) {
    const { options, update } = usePlayersOptions();
    const isChecked = options[rowIndex].isVoiceEnabled;
    const onChange = (event) => {
        const isChecked = event.target.checked;
        update(options.map((options, index) => {
            if (index === rowIndex) {
                return {
                    ...options,
                    isVoiceEnabled: isChecked,
                };
            }
            return options;
        }));
    };
    return React.createElement(Checkbox, { onChange: onChange, isChecked: isChecked });
}
//# sourceMappingURL=enable-player-voices-checkbox.js.map