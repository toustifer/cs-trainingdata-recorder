import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
export function PlayerVoicesCheckbox({ defaultChecked, onChange }) {
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Player voices"), defaultChecked: defaultChecked, onChange: (event) => {
            onChange(event.target.checked);
        } }));
}
//# sourceMappingURL=player-voices-checkbox.js.map