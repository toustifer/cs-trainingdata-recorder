import React from 'react';
export function ActionBar({ left, right }) {
    return (React.createElement("div", { className: "flex flex-wrap items-center border-b border-b-gray-300 p-8" },
        React.createElement("div", { className: "flex flex-1 flex-wrap items-center gap-8" }, left),
        React.createElement("div", { className: "flex flex-wrap items-center gap-8" }, right)));
}
//# sourceMappingURL=action-bar.js.map