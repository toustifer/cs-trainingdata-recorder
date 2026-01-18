import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
export function RecordingPlayerVoices() {
    const { settings, updateSettings } = useVideoSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: settings.playerVoicesEnabled, onChange: (isChecked) => {
                updateSettings({ playerVoicesEnabled: isChecked });
            } }), description: React.createElement(React.Fragment, null,
            React.createElement("p", null,
                React.createElement(Trans, null, "Listen to player voices during recording.")),
            React.createElement("div", { className: "mt-4 flex items-center gap-x-4" },
                React.createElement(ExclamationTriangleIcon, { className: "size-12 shrink-0 text-orange-700" }),
                React.createElement("p", { className: "text-caption" },
                    React.createElement(Trans, null, "Player voices are not available in Valve Matchmaking demos!")))), title: React.createElement(Trans, { context: "Settings title" }, "Player voices") }));
}
//# sourceMappingURL=recording-player-voices.js.map