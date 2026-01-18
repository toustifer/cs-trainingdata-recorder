import React, {} from 'react';
import { AutoDownloadThirdPartyDemos } from './auto-download-third-party-demos';
import { AutoDownloadThirdPartyDemosBackground } from './auto-download-third-party-demos-background';
export function ThirdPartySettings({ name, logo, warning, autoDownloadAtStartupSettingsKey, autoDownloadInBackgroundSettingsKey, children, }) {
    return (React.createElement("div", { className: "mt-12" },
        React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement("h2", { className: "text-subtitle" }, name),
            logo),
        warning && React.createElement("div", { className: "py-8" }, warning),
        React.createElement(AutoDownloadThirdPartyDemos, { name: name, settingsKey: autoDownloadAtStartupSettingsKey }),
        React.createElement(AutoDownloadThirdPartyDemosBackground, { name: name, settingsKey: autoDownloadInBackgroundSettingsKey }),
        children));
}
//# sourceMappingURL=third-party-settings.js.map