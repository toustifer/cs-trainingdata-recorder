import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { defaultSettings } from 'csdm/node/settings/default-settings';
export function VideoCodecInput() {
    const { settings, updateSettings } = useVideoSettings();
    const onBlur = (event) => {
        const newVideoCodec = event.target.value.trim();
        if (newVideoCodec === '') {
            event.target.value = defaultSettings.video.ffmpegSettings.videoCodec;
        }
        else if (newVideoCodec !== settings.ffmpegSettings.videoCodec) {
            updateSettings({
                ffmpegSettings: {
                    videoCodec: newVideoCodec,
                },
            });
        }
    };
    return (React.createElement(TextInput, { key: settings.ffmpegSettings.videoCodec, label: React.createElement(Trans, { context: "Input label" }, "Video codec"), onBlur: onBlur, defaultValue: settings.ffmpegSettings.videoCodec }));
}
//# sourceMappingURL=video-codec-input.js.map