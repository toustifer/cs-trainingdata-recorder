import React, { useState } from 'react';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { usePlayersOptions } from './use-players-options';
export function PlayerNameInput({ rowIndex }) {
    const { options, update } = usePlayersOptions();
    const [playerName, setPlayerName] = useState(options[rowIndex].playerName);
    // Player's name edition is available only on Windows
    const isDisabled = !window.csdm.isWindows;
    const onChange = (event) => {
        const value = event.target.value;
        setPlayerName(value);
    };
    const onBlur = () => {
        update(options.map((options, index) => {
            if (index === rowIndex) {
                return {
                    ...options,
                    playerName,
                };
            }
            return options;
        }));
    };
    return React.createElement(TextInput, { onChange: onChange, onBlur: onBlur, value: playerName, isDisabled: isDisabled });
}
//# sourceMappingURL=player-name-input.js.map