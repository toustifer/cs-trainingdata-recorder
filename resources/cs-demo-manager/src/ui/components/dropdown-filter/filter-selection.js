import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ActiveFilterIndicator } from './active-filter-indicator';
function Button({ children, onClick }) {
    return (React.createElement("button", { className: "cursor-auto text-caption hover:text-gray-900", onClick: onClick }, children));
}
export function FilterSelection({ hasActiveFilter, onDeselectAllClick, onSelectAllClick }) {
    return (React.createElement("div", { className: "flex items-center gap-x-8 pr-4" },
        hasActiveFilter && React.createElement(ActiveFilterIndicator, null),
        React.createElement(Button, { onClick: onSelectAllClick },
            React.createElement(Trans, { context: "Button filter" }, "All")),
        React.createElement(Button, { onClick: onDeselectAllClick },
            React.createElement(Trans, { context: "Button filter" }, "None"))));
}
//# sourceMappingURL=filter-selection.js.map