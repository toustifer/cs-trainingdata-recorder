import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SettingsCategoryButton } from 'csdm/ui/settings/settings-category-button';
import { CloseSettingsButton } from './close-settings-button';
import { SettingsCategory } from './settings-category';
export function SettingsTabs() {
    return (React.createElement("div", { className: "flex h-full flex-col overflow-y-auto border-r border-r-gray-300 bg-gray-50 p-16" },
        React.createElement(CloseSettingsButton, null),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.UI },
            React.createElement(Trans, null, "UI")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Folders },
            React.createElement(Trans, null, "Folders")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Tags },
            React.createElement(Trans, null, "Tags")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Maps },
            React.createElement(Trans, null, "Maps")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Download },
            React.createElement(Trans, null, "Download")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Playback },
            React.createElement(Trans, null, "Playback")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Analyze },
            React.createElement(Trans, null, "Analyze")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Video },
            React.createElement(Trans, null, "Video")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Cameras },
            React.createElement(Trans, null, "Cameras")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Ban },
            React.createElement(Trans, null, "Ban")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Integrations },
            React.createElement(Trans, null, "Integrations")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.Database },
            React.createElement(Trans, null, "Database")),
        React.createElement(SettingsCategoryButton, { category: SettingsCategory.About },
            React.createElement(Trans, null, "About"))));
}
//# sourceMappingURL=settings-tabs.js.map