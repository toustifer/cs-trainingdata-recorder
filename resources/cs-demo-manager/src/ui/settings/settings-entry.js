import React from 'react';
export function SettingsEntry({ title, interactiveComponent, description }) {
    return (React.createElement("div", { className: "flex items-center justify-between border-b border-b-gray-300 py-8" },
        React.createElement("div", { className: "pr-16" },
            React.createElement("p", { className: "text-body-strong" }, title),
            React.createElement("div", { className: "mt-4" }, description)),
        React.createElement("div", null, interactiveComponent)));
}
//# sourceMappingURL=settings-entry.js.map