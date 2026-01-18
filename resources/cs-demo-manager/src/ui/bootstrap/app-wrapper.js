import React from 'react';
export function AppWrapper({ children }) {
    return React.createElement("div", { className: "flex h-[calc(100vh-var(--title-bar-height))] overflow-hidden" }, children);
}
//# sourceMappingURL=app-wrapper.js.map