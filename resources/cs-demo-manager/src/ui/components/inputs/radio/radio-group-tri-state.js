import React, {} from 'react';
import { Radio, RadioGroup } from './radio-group';
import { Trans } from '@lingui/react/macro';
import { TriStateFilter } from 'csdm/common/types/tri-state-filter';
export function RadioGroupTriState({ label, value, onChange }) {
    return (React.createElement(RadioGroup, { label: label, value: value, onChange: onChange },
        React.createElement(Radio, { value: TriStateFilter.All },
            React.createElement(Trans, null, "All")),
        React.createElement(Radio, { value: TriStateFilter.Yes },
            React.createElement(Trans, null, "Yes")),
        React.createElement(Radio, { value: TriStateFilter.No },
            React.createElement(Trans, null, "No"))));
}
//# sourceMappingURL=radio-group-tri-state.js.map