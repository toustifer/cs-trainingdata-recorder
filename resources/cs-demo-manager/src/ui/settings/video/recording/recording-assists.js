import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Switch } from 'csdm/ui/components/inputs/switch';
export function RecordingAssists() {
    const { settings, updateSettings } = useVideoSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: settings.showAssists, onChange: (isChecked) => {
                updateSettings({ showAssists: isChecked });
            } }), description: React.createElement("p", null,
            React.createElement(Trans, null, "Show assists in kill feed.")), title: React.createElement(Trans, { context: "Settings title" }, "Show Assists") }));
}
//# sourceMappingURL=recording-assists.js.map