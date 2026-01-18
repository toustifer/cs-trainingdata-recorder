import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
export function XRayCheckbox({ defaultChecked, onChange }) {
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Show X-Ray"), defaultChecked: defaultChecked, onChange: (event) => {
            onChange(event.target.checked);
        } }));
}
//# sourceMappingURL=x-ray-checkbox.js.map