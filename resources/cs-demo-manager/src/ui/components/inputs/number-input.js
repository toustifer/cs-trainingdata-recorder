import React, { useEffect, useId, useRef } from 'react';
export function InputNumber({ id, allowNegativeNumber = false, allowDecimal = false, isDisabled, focusOnMount, label, ...props }) {
    const randomId = useId();
    const inputRef = useRef(null);
    const isAllowedKey = (key) => {
        if (key === '+' || key === 'e') {
            return false;
        }
        if (!allowNegativeNumber && key === '-') {
            return false;
        }
        if (!allowDecimal && (key === '.' || key === ',')) {
            return false;
        }
        return true;
    };
    useEffect(() => {
        if (focusOnMount) {
            setTimeout(() => {
                if (inputRef.current !== null) {
                    inputRef.current.focus();
                }
            }, 0);
        }
    }, [focusOnMount]);
    const onKeyDown = (event) => {
        if (!isAllowedKey(event.key.toLowerCase())) {
            event.preventDefault();
        }
    };
    const input = (React.createElement("input", { ref: inputRef, id: id ?? randomId, type: "number", className: "h-[30px] appearance-none rounded border border-gray-300 bg-gray-50 px-12 text-gray-800 outline-hidden transition-all duration-85 placeholder:text-gray-500 focus:border-gray-900 hover:enabled:border-gray-600 hover:enabled:focus:border-gray-900 disabled:cursor-default disabled:bg-gray-200 disabled:text-gray-500", min: allowNegativeNumber ? undefined : 0, onKeyDown: onKeyDown, disabled: isDisabled, ...props }));
    if (label === undefined) {
        return input;
    }
    return (React.createElement("div", { className: "flex flex-col gap-8" },
        React.createElement("label", { htmlFor: id ?? randomId }, label),
        React.createElement("div", null, input)));
}
//# sourceMappingURL=number-input.js.map