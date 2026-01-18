import React from 'react';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { Trans } from '@lingui/react/macro';
export function FfmpegAudioBitrateSelect() {
    const { settings, updateSettings } = useVideoSettings();
    const options = [128, 256, 320].map((bitrate) => {
        return {
            value: bitrate,
            label: bitrate,
        };
    });
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Audio bitrate")),
        React.createElement(Select, { options: options, value: settings.ffmpegSettings.audioBitrate, onChange: async (audioBitrate) => {
                await updateSettings({
                    ffmpegSettings: {
                        audioBitrate: Number(audioBitrate),
                    },
                });
            } })));
}
//# sourceMappingURL=ffmpeg-audio-bitrate-select.js.map