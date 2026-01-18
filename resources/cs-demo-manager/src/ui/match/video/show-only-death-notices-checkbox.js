import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
export function ShowOnlyDeathNoticesCheckbox({ isChecked, onChange }) {
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Input label" }, "Show only death notices"), isChecked: isChecked, onChange: (event) => {
            onChange(event.target.checked);
        } }));
}
//# sourceMappingURL=show-only-death-notices-checkbox.js.map