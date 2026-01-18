import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { EncoderSoftware } from 'csdm/common/types/encoder-software';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { RecordingOutput } from 'csdm/common/types/recording-output';
export function EncoderSoftwareSelect() {
    const { settings, updateSettings } = useVideoSettings();
    if (!window.csdm.isWindows || settings.recordingOutput === RecordingOutput.Images) {
        return null;
    }
    const options = [
        {
            value: EncoderSoftware.VirtualDub,
            label: 'VirtualDub',
        },
        {
            value: EncoderSoftware.FFmpeg,
            label: 'FFmpeg',
        },
    ];
    return (React.createElement("div", { className: "mb-8 flex w-[152px] flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Select label of video encoder" }, "Encoder software")),
        React.createElement(Select, { options: options, value: settings.encoderSoftware, onChange: async (encoderSoftware) => {
                await updateSettings({
                    encoderSoftware,
                });
                const isConcatenationAvailable = encoderSoftware === EncoderSoftware.FFmpeg;
                if (!isConcatenationAvailable) {
                    await updateSettings({
                        concatenateSequences: false,
                    });
                }
            } })));
}
//# sourceMappingURL=encoder-software-select.js.map