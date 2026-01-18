import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import React from 'react';
export function ErrorMessage({ message }) {
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(ExclamationTriangleIcon, { className: "size-20 text-red-700" }),
        React.createElement("p", { className: "leading-none" }, message)));
}
//# sourceMappingURL=error-message.js.map