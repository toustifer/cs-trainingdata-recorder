import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { DownloadFolderPath } from './download-folder-path';
import { FaceitSettings } from './faceit-settings';
import { ValveSettings } from './valve-settings';
import { FiveEPlaySettings } from './5eplay-settings';
import { RenownSettings } from './renown-settings';
export function DownloadSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement("div", { className: "flex flex-col gap-y-12" },
            React.createElement(DownloadFolderPath, null),
            React.createElement(ValveSettings, null),
            React.createElement(FaceitSettings, null),
            React.createElement(RenownSettings, null),
            React.createElement(FiveEPlaySettings, null))));
}
//# sourceMappingURL=download-view.js.map