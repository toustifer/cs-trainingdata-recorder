import React, { useEffect, useRef, useImperativeHandle, useId } from 'react';
export function TextInput({ isDisabled, isReadOnly, autoFocus, onEnterKeyDown, label, onKeyDown, ref, ...props }) {
    const inputRef = useRef(null);
    const id = useId();
    useImperativeHandle(ref, () => {
        return {
            focus: () => {
                inputRef.current?.focus();
            },
            blur: () => {
                inputRef.current?.blur();
            },
            setValue: (value) => {
                if (inputRef.current) {
                    inputRef.current.value = value;
                }
            },
            value: () => {
                if (inputRef.current) {
                    return inputRef.current.value;
                }
                return '';
            },
        };
    });
    useEffect(() => {
        if (autoFocus) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [autoFocus]);
    const handleKeyDown = (event) => {
        onKeyDown?.(event);
        if (event.key === 'Enter' && typeof onEnterKeyDown === 'function') {
            onEnterKeyDown(event);
        }
    };
    const input = (React.createElement("input", { className: "relative h-[30px] w-full appearance-none rounded border border-gray-400 bg-gray-50 px-12 text-gray-800 outline-hidden transition-all duration-85 placeholder:text-gray-600 focus:border-gray-900 hover:enabled:border-gray-900 enabled:focus:border-gray-900 disabled:cursor-default disabled:bg-gray-100 disabled:text-gray-700", ref: inputRef, disabled: isDisabled, onKeyDown: handleKeyDown, readOnly: isReadOnly, id: id, ...props }));
    if (label === undefined) {
        return input;
    }
    return (React.createElement("div", { className: "flex flex-col gap-8" },
        React.createElement("label", { htmlFor: id }, label),
        input));
}
//# sourceMappingURL=text-input.js.map