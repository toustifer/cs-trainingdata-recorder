import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
export function AssistsCheckbox({ defaultChecked, onChange }) {
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Show assists"), defaultChecked: defaultChecked, onChange: (event) => {
            onChange(event.target.checked);
        } }));
}
//# sourceMappingURL=assists-checkbox.js.map