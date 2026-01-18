import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Switch } from 'csdm/ui/components/inputs/switch';
export function RecordingXRay() {
    const { settings, updateSettings } = useVideoSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: settings.showXRay, onChange: (isChecked) => {
                updateSettings({ showXRay: isChecked });
            } }), description: React.createElement("p", null,
            React.createElement(Trans, null, "See players through walls during recording.")), title: React.createElement(Trans, { context: "Settings title" }, "Show X-Ray") }));
}
//# sourceMappingURL=recording-x-ray.js.map