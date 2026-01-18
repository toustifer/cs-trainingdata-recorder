import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { VideoContainer } from 'csdm/common/types/video-container';
export function VideoContainerSelect() {
    const { settings, updateSettings } = useVideoSettings();
    const options = Object.values(VideoContainer).map((container) => {
        return {
            value: container,
            label: container,
        };
    });
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Video container")),
        React.createElement(Select, { options: options, value: settings.ffmpegSettings.videoContainer, onChange: async (videoContainer) => {
                await updateSettings({
                    ffmpegSettings: {
                        videoContainer,
                    },
                });
            } })));
}
//# sourceMappingURL=video-container-select.js.map