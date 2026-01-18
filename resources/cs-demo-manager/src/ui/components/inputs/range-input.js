import React, {} from 'react';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
export function RangeInput({ label, value, onChange, min, max, step }) {
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null, label),
        React.createElement("input", { type: "range", min: min, step: step, max: max, value: value, onChange: (event) => {
                onChange(Number(event.target.value));
            } })));
}
//# sourceMappingURL=range-input.js.map