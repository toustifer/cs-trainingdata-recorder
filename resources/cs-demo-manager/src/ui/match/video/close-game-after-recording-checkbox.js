import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
export function CloseGameAfterRecordingCheckbox() {
    const { settings, updateSettings } = useVideoSettings();
    const onChange = async (event) => {
        await updateSettings({
            closeGameAfterRecording: event.target.checked,
        });
    };
    return (React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Close the game when recording is done"), onChange: onChange, isChecked: settings.closeGameAfterRecording }));
}
//# sourceMappingURL=close-game-after-recording-checkbox.js.map