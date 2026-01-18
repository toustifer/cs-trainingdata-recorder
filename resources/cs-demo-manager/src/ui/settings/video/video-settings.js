import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { HlaeConfigFolderPath } from './hlae/hlae-config-folder-path';
import { FfmpegLocation } from './ffmpeg/ffmpeg-location';
import { HlaeLocation } from './hlae/hlae-location';
import { DefaultVideoRecordingSettings } from './recording/default-video-recording-settings';
import { HlaeParameters } from 'csdm/ui/match/video/hlae/hlae-parameters';
export function VideoSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement("div", { className: "flex flex-col gap-y-12" },
            window.csdm.isWindows && (React.createElement("div", null,
                React.createElement("p", { className: "mb-8 text-subtitle" }, "HLAE"),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(HlaeLocation, null),
                    React.createElement(HlaeConfigFolderPath, null),
                    React.createElement(HlaeParameters, null)))),
            React.createElement("div", null,
                React.createElement("p", { className: "mb-8 text-subtitle" }, "FFmpeg"),
                React.createElement(FfmpegLocation, null)),
            React.createElement(DefaultVideoRecordingSettings, null))));
}
//# sourceMappingURL=video-settings.js.map