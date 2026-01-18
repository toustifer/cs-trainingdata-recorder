import React from 'react';
import { useSequenceForm } from './use-sequence-form';
import { ShowOnlyDeathNoticesCheckbox } from '../show-only-death-notices-checkbox';
export function SequenceShowOnlyDeathNoticesCheckbox() {
    const { sequence, updateSequence } = useSequenceForm();
    const onChange = (isChecked) => {
        updateSequence({
            showOnlyDeathNotices: isChecked,
        });
    };
    return React.createElement(ShowOnlyDeathNoticesCheckbox, { onChange: onChange, isChecked: sequence.showOnlyDeathNotices });
}
//# sourceMappingURL=show-only-death-notices-checkbox.js.map