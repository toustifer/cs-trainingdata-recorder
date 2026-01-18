import React from 'react';
export function Content({ children }) {
    return React.createElement("div", { className: "flex flex-1 flex-col overflow-y-auto p-16" }, children);
}
export function CenteredContent({ children }) {
    return React.createElement("div", { className: "flex flex-1 flex-col items-center justify-center overflow-y-auto p-16" }, children);
}
//# sourceMappingURL=content.js.map