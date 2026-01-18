import React from 'react';
import { AnalyzeSettings } from './analyze/analyze-settings';
import { DatabaseSettings } from './database/database-settings';
import { DownloadSettings } from './downloads/download-view';
import { FoldersSettings } from './folders/folders-settings';
import { VideoSettings } from './video/video-settings';
import { MapsSettings } from './maps/maps-settings';
import { SettingsCategory } from './settings-category';
import { IntegrationsSettings } from './integrations/integrations-settings';
import { UiSettings } from './ui/ui-settings';
import { useSettingsOverlay } from './use-settings-overlay';
import { PlaybackSettings } from './playback/playback-settings';
import { TagsSettings } from './tags/tags-settings';
import { BanSettings } from './bans/ban-settings';
import { assertNever } from 'csdm/common/assert-never';
import { About } from './about/about';
import { CamerasSettings } from './cameras/cameras-settings';
export function Settings() {
    const { category } = useSettingsOverlay();
    switch (category) {
        case SettingsCategory.Folders:
            return React.createElement(FoldersSettings, null);
        case SettingsCategory.Database:
            return React.createElement(DatabaseSettings, null);
        case SettingsCategory.UI:
            return React.createElement(UiSettings, null);
        case SettingsCategory.Analyze:
            return React.createElement(AnalyzeSettings, null);
        case SettingsCategory.Download:
            return React.createElement(DownloadSettings, null);
        case SettingsCategory.Playback:
            return React.createElement(PlaybackSettings, null);
        case SettingsCategory.Video:
            return React.createElement(VideoSettings, null);
        case SettingsCategory.Maps:
            return React.createElement(MapsSettings, null);
        case SettingsCategory.Tags:
            return React.createElement(TagsSettings, null);
        case SettingsCategory.Ban:
            return React.createElement(BanSettings, null);
        case SettingsCategory.Integrations:
            return React.createElement(IntegrationsSettings, null);
        case SettingsCategory.About:
            return React.createElement(About, null);
        case SettingsCategory.Cameras:
            return React.createElement(CamerasSettings, null);
        default:
            return assertNever(category, `Unknown settings category: ${category}`);
    }
}
//# sourceMappingURL=settings.js.map