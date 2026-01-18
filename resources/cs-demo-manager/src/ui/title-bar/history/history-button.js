import React, {} from 'react';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function HistoryButton({ children, onClick, isDisabled, tooltip }) {
    return (React.createElement(Tooltip, { content: tooltip },
        React.createElement("button", { className: "flex size-28 items-center justify-center rounded text-gray-900 hover:bg-gray-300 aria-disabled:cursor-default aria-disabled:opacity-40 aria-disabled:hover:bg-transparent", onClick: isDisabled ? undefined : onClick, "aria-disabled": isDisabled }, children)));
}
//# sourceMappingURL=history-button.js.map