import React, { useId } from 'react';
import { InputLabel } from './input-label';
import { InputNumber } from './number-input';
export function SecondsInput({ label, defaultValue, onChange }) {
    const id = useId();
    const min = 0;
    const max = 30;
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id }, label),
        React.createElement("div", { className: "w-[5rem]" },
            React.createElement(InputNumber, { id: id, min: min, max: max, placeholder: String(2), defaultValue: defaultValue, onChange: (event) => {
                    if (!(event.target instanceof HTMLInputElement)) {
                        return;
                    }
                    const value = Number(event.target.value);
                    if (value >= min && value <= max) {
                        onChange(value);
                    }
                } }))));
}
//# sourceMappingURL=seconds-input.js.map