import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { EncoderSoftware } from 'csdm/common/types/encoder-software';
import { RecordingOutput } from 'csdm/common/types/recording-output';
export function ConcatenateSequencesCheckbox() {
    const { settings, updateSettings } = useVideoSettings();
    const onChange = async (event) => {
        await updateSettings({
            concatenateSequences: event.target.checked,
        });
    };
    if (settings.encoderSoftware !== EncoderSoftware.FFmpeg || settings.recordingOutput === RecordingOutput.Images) {
        return null;
    }
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Concatenate sequences into 1 video"), onChange: onChange, isChecked: settings.concatenateSequences }));
}
//# sourceMappingURL=concatenate-sequences-checkbox.js.map