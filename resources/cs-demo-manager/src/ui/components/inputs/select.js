import React from 'react';
export function Select({ options, value, onChange, isDisabled = false, id, }) {
    return (React.createElement("select", { id: id, className: "h-[30px] appearance-none rounded border border-gray-400 bg-gray-50 pl-12 outline-hidden focus:border-gray-900 enabled:hover:border-gray-900 disabled:bg-gray-400", disabled: isDisabled, value: value, onChange: (event) => {
            onChange(event.target.value);
        } }, options.map((option) => {
        return (React.createElement("option", { value: option.value, key: option.value }, option.label));
    })));
}
//# sourceMappingURL=select.js.map