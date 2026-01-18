import React, { useState } from 'react';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import type { SequencePlayerOptions } from 'csdm/common/types/sequence-player-options';
import type { CellProps } from 'csdm/ui/components/table/table-types';
import { useSequenceForm } from './use-sequence-form';

type Props = CellProps<SequencePlayerOptions>;

export function PlayerNameInput({ rowIndex }: Props) {
  const { sequence, updateSequence } = useSequenceForm();
  const [playerName, setPlayerName] = useState(sequence.playersOptions[rowIndex].playerName);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  return <TextInput onChange={onChange} onBlur={onBlur} value={playerName} isDisabled={!window.csdm.isWindows} />;
}
