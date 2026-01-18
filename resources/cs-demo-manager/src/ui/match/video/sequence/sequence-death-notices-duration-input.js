import React from 'react';
import { useSequenceForm } from './use-sequence-form';
import { DeathNoticesDurationInput } from '../death-notices-duration-input';
export function SequenceDeathNoticesDurationInput() {
    const { sequence, updateSequence } = useSequenceForm();
    const onBlur = (duration) => {
        updateSequence({
            deathNoticesDuration: duration,
        });
    };
    return React.createElement(DeathNoticesDurationInput, { value: sequence.deathNoticesDuration, onBlur: onBlur });
}
//# sourceMappingURL=sequence-death-notices-duration-input.js.map