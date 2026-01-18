import React, { useEffect, useRef } from 'react';
import {} from 'react';
import { SettingsTabs } from 'csdm/ui/settings/settings-tabs';
export function SettingsView({ children }) {
    const container = useRef(null);
    useEffect(() => {
        container.current?.focus();
    }, []);
    return (React.createElement("div", { ref: container, className: "flex h-full flex-1 overflow-y-auto pt-[var(--title-bar-height)]", tabIndex: -1 },
        React.createElement(SettingsTabs, null),
        React.createElement("div", { className: "flex flex-1 flex-col overflow-y-auto bg-gray-50 p-16" },
            React.createElement("div", { className: "max-w-[900px]" }, children))));
}
//# sourceMappingURL=settings-view.js.map