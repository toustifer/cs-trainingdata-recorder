import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
export function RecordAudioCheckbox({ defaultChecked, onChange }) {
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Record Audio"), defaultChecked: defaultChecked, onChange: (event) => {
            onChange(event.target.checked);
        } }));
}
//# sourceMappingURL=record-audio-checkbox.js.map