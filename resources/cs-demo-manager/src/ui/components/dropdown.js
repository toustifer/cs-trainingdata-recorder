import React, { useState } from 'react';
import { ChevronDown } from 'csdm/ui/icons/chevron-down-icon';
import { Button } from './buttons/button';
import { useOutsideClick } from 'csdm/ui/hooks/use-outside-click';
export function Dropdown({ togglerContent, children, isDisabled = false }) {
    const [isOpened, setIsOpened] = useState(false);
    const content = useOutsideClick((event) => {
        if (!isOpened) {
            return;
        }
        event.stopPropagation();
        setIsOpened(false);
    });
    const onClick = () => {
        setIsOpened((isOpened) => !isOpened);
    };
    return (React.createElement("div", { className: "relative" },
        React.createElement(Button, { isDisabled: isDisabled, onClick: onClick },
            togglerContent,
            React.createElement("div", { className: "ml-8 flex items-center" },
                React.createElement(ChevronDown, { width: 14 }))),
        React.createElement("div", { ref: content }, isOpened && (React.createElement("div", { className: "absolute right-0 z-2 mt-8" },
            React.createElement("div", { className: "flex flex-col overflow-hidden rounded-8 bg-gray-75 shadow-[0_0_4px_0_var(--color-gray-500)]" }, children))))));
}
//# sourceMappingURL=dropdown.js.map