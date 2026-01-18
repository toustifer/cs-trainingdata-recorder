import React from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { Select } from 'csdm/ui/components/inputs/select';
import { Perspective } from 'csdm/common/types/perspective';
export function PerspectiveSelect({ perspective, onChange }) {
    const options = [
        {
            label: React.createElement(Trans, null, "Player"),
            value: Perspective.Player,
        },
        {
            label: React.createElement(Trans, null, "Enemy"),
            value: Perspective.Enemy,
        },
    ];
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Select label" }, "Point of view")),
        React.createElement("div", null,
            React.createElement(Select, { options: options, value: perspective, onChange: onChange }))));
}
//# sourceMappingURL=perspective-select.js.map