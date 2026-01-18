import React, { useId } from 'react';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
export function Radio({ value, children }) {
    return (React.createElement("label", null,
        React.createElement(BaseRadio.Root, { value: value, className: "m-0 flex size-16 items-center justify-center rounded-full p-0 outline-0 focus-visible:outline-2 focus-visible:outline-offset-2 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-700 data-unchecked:bg-transparent" },
            React.createElement(BaseRadio.Indicator, { className: "flex items-center justify-center before:h-8 before:w-8 before:rounded-full before:bg-gray-50 before:content-[''] data-unchecked:hidden" })),
        children));
}
export function RadioGroup({ label, children, value, onChange }) {
    const id = useId();
    return (React.createElement(BaseRadioGroup, { "aria-labelledby": id, className: "flex flex-col gap-y-8", value: value, onValueChange: (value) => {
            if (typeof value === 'string') {
                onChange(value);
            }
        } },
        React.createElement("div", { id: id }, label),
        React.createElement("div", { className: "flex gap-16" }, children)));
}
//# sourceMappingURL=radio-group.js.map