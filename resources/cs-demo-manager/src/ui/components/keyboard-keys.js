import React, {} from 'react';
export function KeyboardKey({ children }) {
    return (React.createElement("div", { className: "flex items-center justify-center rounded-4 border border-gray-400 bg-gray-50 px-8 py-4 text-caption font-bold" },
        React.createElement("p", null, children)));
}
export function KeyboardKeys({ children }) {
    return React.createElement("div", { className: "flex items-center gap-x-4" }, children);
}
//# sourceMappingURL=keyboard-keys.js.map