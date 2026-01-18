import React from 'react';
export function TableStatusBarLegend({ text, rectangle }) {
    return (React.createElement("div", { className: "flex items-center" },
        rectangle,
        React.createElement("p", { className: "ml-4 selectable" }, text)));
}
//# sourceMappingURL=table-status-bar-legend.js.map