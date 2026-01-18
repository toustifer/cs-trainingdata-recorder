import React, {} from 'react';
import { ExclamationTriangleIcon } from '../icons/exclamation-triangle-icon';
export function LoadingError({ title, error }) {
    return (React.createElement("div", { className: "flex h-screen flex-col items-center justify-center" },
        React.createElement("div", null,
            React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement(ExclamationTriangleIcon, { className: "size-24 text-red-700" }),
                React.createElement("p", { className: "text-title" }, title)),
            React.createElement("p", { className: "mt-8 text-body-strong select-text" }, error))));
}
//# sourceMappingURL=loading-error.js.map