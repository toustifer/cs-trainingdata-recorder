import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { defaultSettings } from 'csdm/node/settings/default-settings';
export function AudioCodecInput() {
    const { settings, updateSettings } = useVideoSettings();
    const onBlur = (event) => {
        const newAudioCodec = event.target.value.trim();
        if (newAudioCodec === '') {
            event.target.value = defaultSettings.video.ffmpegSettings.audioCodec;
        }
        else if (newAudioCodec !== settings.ffmpegSettings.audioCodec) {
            updateSettings({
                ffmpegSettings: {
                    audioCodec: newAudioCodec,
                },
            });
        }
    };
    return (React.createElement(TextInput, { key: settings.ffmpegSettings.audioCodec, label: React.createElement(Trans, { context: "Input label" }, "Audio codec"), onBlur: onBlur, defaultValue: settings.ffmpegSettings.audioCodec }));
}
//# sourceMappingURL=audio-codec-input.js.map