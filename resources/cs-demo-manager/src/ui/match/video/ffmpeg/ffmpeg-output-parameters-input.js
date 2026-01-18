import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
export function FfmpegOutputParametersInput() {
    const { settings, updateSettings } = useVideoSettings();
    const onBlur = (event) => {
        const outputParameters = event.target.value;
        if (outputParameters !== settings.ffmpegSettings.outputParameters) {
            updateSettings({
                ffmpegSettings: {
                    outputParameters,
                },
            });
        }
    };
    return (React.createElement(TextInput, { key: settings.ffmpegSettings.outputParameters, label: React.createElement(Trans, { context: "Input label" }, "Output parameters"), onBlur: onBlur, defaultValue: settings.ffmpegSettings.outputParameters }));
}
//# sourceMappingURL=ffmpeg-output-parameters-input.js.map