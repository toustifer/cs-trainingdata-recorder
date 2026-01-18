import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Switch } from 'csdm/ui/components/inputs/switch';
export function RecordingShowOnlyDeathNotices() {
    const { settings, updateSettings } = useVideoSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: settings.showOnlyDeathNotices, onChange: (isChecked) => {
                updateSettings({ showOnlyDeathNotices: isChecked });
            } }), description: React.createElement("p", null,
            React.createElement(Trans, null, "Show only death notices during recording.")), title: React.createElement(Trans, { context: "Settings title" }, "Show only death notices") }));
}
//# sourceMappingURL=recording-show-only-death-notices.js.map