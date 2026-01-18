import React, { useId } from 'react';
export function Checkbox({ label, isChecked, isDisabled, ...props }) {
    const id = useId();
    return (React.createElement("div", { className: "flex flex-none items-center gap-x-8" },
        React.createElement("input", { id: id, type: "checkbox", className: "outline-offset-0 outline-gray-800 focus-visible:outline", checked: isChecked, disabled: isDisabled, ...props }),
        label && React.createElement("label", { htmlFor: id }, label)));
}
//# sourceMappingURL=checkbox.js.map