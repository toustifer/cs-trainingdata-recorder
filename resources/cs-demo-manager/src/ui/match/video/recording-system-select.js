import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { RecordingSystem } from 'csdm/common/types/recording-system';
export function RecordingSystemSelect() {
    const { settings, updateSettings } = useVideoSettings();
    const options = [
        {
            value: RecordingSystem.HLAE,
            label: 'HLAE',
        },
        {
            value: RecordingSystem.CounterStrike,
            label: 'Counter-Strike',
        },
    ];
    return (React.createElement("div", { className: "mb-8 flex w-[152px] flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Select label" }, "Recording system")),
        React.createElement(Select, { options: options, value: settings.recordingSystem, onChange: async (recordingSystem) => {
                await updateSettings({
                    recordingSystem,
                });
            } })));
}
//# sourceMappingURL=recording-system-select.js.map