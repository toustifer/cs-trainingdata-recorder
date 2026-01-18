import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { RecordingOutput as Output } from 'csdm/common/types/recording-output';
import { RecordingOutput } from './recording-output';
export function RecordingOutputSelect() {
    const { settings, updateSettings } = useVideoSettings();
    const options = Object.values(Output).map((output) => {
        return {
            value: output,
            label: React.createElement(RecordingOutput, { output: output }),
        };
    });
    return (React.createElement("div", { className: "mb-8 flex w-[152px] flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Select label" }, "Output")),
        React.createElement(Select, { options: options, value: settings.recordingOutput, onChange: async (recordingOutput) => {
                await updateSettings({
                    recordingOutput,
                });
            } })));
}
//# sourceMappingURL=recording-output-select.js.map