import React, { useState } from 'react';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { useSequenceForm } from './use-sequence-form';
export function PlayerNameInput({ rowIndex }) {
    const { sequence, updateSequence } = useSequenceForm();
    const [playerName, setPlayerName] = useState(sequence.playersOptions[rowIndex].playerName);
    const onChange = (event) => {
        const value = event.target.value;
        setPlayerName(value);
    };
    const onBlur = () => {
        updateSequence({
            playersOptions: sequence.playersOptions.map((options, index) => {
                if (index === rowIndex) {
                    return {
                        ...options,
                        playerName,
                    };
                }
                return options;
            }),
        });
    };
    return React.createElement(TextInput, { onChange: onChange, onBlur: onBlur, value: playerName, isDisabled: !window.csdm.isWindows });
}
//# sourceMappingURL=player-name-input.js.map