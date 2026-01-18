import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RecordingGameWidth } from './recording-game-width';
import { RecordingGameHeight } from './recording-game-height';
import { RecordingXRay } from './recording-x-ray';
import { RecordingPlayerVoices } from './recording-player-voices';
import { RecordingDeathNoticesDuration } from './recording-death-notices-duration';
import { RecordingShowOnlyDeathNotices } from './recording-show-only-death-notices';
import { RecordingAssists } from './recording-assists';
import { RecordingAudio } from './recording-audio';
export function DefaultVideoRecordingSettings() {
    return (React.createElement("div", null,
        React.createElement("h2", { className: "mb-8 text-subtitle" },
            React.createElement(Trans, null, "Default recording settings")),
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement(RecordingGameWidth, null),
            React.createElement(RecordingGameHeight, null),
            React.createElement(RecordingXRay, null),
            React.createElement(RecordingAssists, null),
            React.createElement(RecordingAudio, null),
            React.createElement(RecordingPlayerVoices, null),
            React.createElement(RecordingShowOnlyDeathNotices, null),
            window.csdm.isWindows && React.createElement(RecordingDeathNoticesDuration, null))));
}
//# sourceMappingURL=default-video-recording-settings.js.map