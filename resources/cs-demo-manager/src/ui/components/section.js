import React from 'react';
export function Section({ title, children }) {
    return (React.createElement("div", { className: "flex flex-col rounded bg-gray-75 p-8" },
        React.createElement("h3", { className: "text-body-strong" }, title),
        React.createElement("div", { className: "mt-4 flex h-full flex-col justify-end" }, children)));
}
//# sourceMappingURL=section.js.map