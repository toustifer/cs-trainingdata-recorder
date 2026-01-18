import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { ChevronDown } from 'csdm/ui/icons/chevron-down-icon';
import { useOutsideClick } from 'csdm/ui/hooks/use-outside-click';
import { ActiveFilterIndicator } from 'csdm/ui/components/dropdown-filter/active-filter-indicator';
export function DropdownFilter({ children, isDisabled, hasActiveFilter }) {
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
        React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("span", null,
                    React.createElement(Trans, { context: "Button" }, "Filters")),
                React.createElement(ChevronDown, { width: 14, className: "ml-8" })),
            hasActiveFilter && (React.createElement("div", { className: "absolute right-4 bottom-4" },
                React.createElement(ActiveFilterIndicator, null)))),
        React.createElement("div", { ref: content }, isOpened && (React.createElement("div", { className: "absolute right-0 z-2 mt-8" },
            React.createElement("div", { className: "flex max-h-[calc(100vh-var(--title-bar-height)-58px)] w-full flex-col overflow-auto rounded-8 bg-gray-75 shadow-[0_0_4px_0_var(--color-gray-500)]" }, children))))));
}
//# sourceMappingURL=dropdown-filter.js.map