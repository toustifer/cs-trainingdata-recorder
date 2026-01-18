import React from 'react';
export function RadioInput({ label, ...props }) {
    return (React.createElement("div", { className: "flex items-center gap-4" },
        React.createElement("input", { type: "radio", ...props }),
        React.createElement("label", { htmlFor: props.id }, label)));
}
//# sourceMappingURL=radio-input.js.map