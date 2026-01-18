import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Switch } from 'csdm/ui/components/inputs/switch';
export function RecordingAudio() {
    const { settings, updateSettings } = useVideoSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: settings.recordAudio, onChange: (isChecked) => {
                updateSettings({ recordAudio: isChecked });
            } }), description: React.createElement("p", null,
            React.createElement(Trans, null, "Record audio during video recording.")), title: React.createElement(Trans, { context: "Settings title" }, "Record Audio") }));
}
//# sourceMappingURL=recording-audio.js.map