import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { TextInput } from './text-input';
export function SearchInput({ isDisabled, placeholder, noResultMessage, search, selectedValues, onValueSelected, onValueRemoved, renderValue, getValueId, renderResult, }) {
    const timer = useRef(0);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const [results, setResults] = useState([]);
    const [isListVisible, setIsListVisible] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const selectValue = (value) => {
        setResults([]);
        onValueSelected(value);
        inputRef.current?.setValue('');
    };
    const onChange = (event) => {
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(async () => {
            const value = event.target.value;
            if (value.length < 2) {
                setFocusedIndex(0);
                setIsListVisible(false);
                setResults([]);
                return;
            }
            const result = await search(value, selectedValues);
            setFocusedIndex(0);
            setIsListVisible(true);
            setResults(result);
        }, 500);
    };
    const onKeyDown = (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            setIsListVisible(false);
            return;
        }
        if (results.length === 0) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const nextIndex = focusedIndex === results.length - 1 ? 0 : focusedIndex + 1;
                setFocusedIndex(nextIndex);
                resultsRef.current?.scrollTo({
                    top: nextIndex * 35,
                });
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                const previousIndex = focusedIndex - 1 < 0 ? results.length - 1 : focusedIndex - 1;
                setFocusedIndex(previousIndex);
                resultsRef.current?.scrollTo({
                    top: previousIndex * 35,
                });
                break;
            }
            case 'Enter': {
                event.preventDefault();
                const result = results[focusedIndex];
                if (result) {
                    selectValue(result);
                }
                break;
            }
        }
    };
    const onFocus = () => {
        setIsListVisible(true);
    };
    const onBlur = () => {
        setIsListVisible(false);
    };
    const renderResults = () => {
        if (!isListVisible || results.length === 0) {
            return null;
        }
        return (React.createElement("div", { className: "absolute z-10 w-full" },
            React.createElement("div", { className: "flex max-h-[200px] flex-col gap-y-4 overflow-auto rounded border border-gray-400 bg-gray-50", ref: resultsRef }, results.length > 0 ? (results.map((result, index) => {
                const hasFocus = focusedIndex === index;
                return (React.createElement("div", { className: clsx('px-8 py-4 hover:bg-gray-100', hasFocus && 'bg-gray-75'), key: getValueId(result), onMouseDown: (event) => {
                        event.stopPropagation();
                        selectValue(result);
                    } }, renderResult(result)));
            })) : (React.createElement("p", { className: "p-8" }, noResultMessage)))));
    };
    const renderSelectedValues = () => {
        if (selectedValues.length === 0) {
            return null;
        }
        return (React.createElement("div", { className: "mt-8 flex max-h-[134px] flex-wrap gap-x-8 gap-y-4 overflow-y-auto" }, selectedValues.map((value) => {
            return (React.createElement("div", { key: getValueId(value), className: "flex items-center justify-center gap-x-8 rounded border px-8 py-4 text-gray-700" },
                renderValue(value),
                React.createElement("button", { disabled: isDisabled, className: "text-gray-800 hover:text-gray-900 hover:disabled:text-gray-800", onClick: () => {
                        onValueRemoved(value);
                    } }, "X")));
        })));
    };
    return (React.createElement("div", { className: "relative" },
        React.createElement(TextInput, { isDisabled: isDisabled, placeholder: placeholder, onChange: onChange, ref: inputRef, onFocus: onFocus, onBlur: onBlur, onKeyDown: onKeyDown }),
        renderResults(),
        renderSelectedValues()));
}
//# sourceMappingURL=search-input.js.map