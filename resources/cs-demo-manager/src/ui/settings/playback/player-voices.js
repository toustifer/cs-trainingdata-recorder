import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { usePlaybackSettings } from './use-playback-settings';
export function PlayerVoices() {
    const { playerVoicesEnabled, updateSettings } = usePlaybackSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            playerVoicesEnabled: isChecked,
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: playerVoicesEnabled, onChange: onChange }), description: React.createElement("div", null,
            React.createElement(Trans, null, "Listen player voices during playback"),
            React.createElement("div", { className: "mt-4 flex items-center gap-x-4" },
                React.createElement(ExclamationTriangleIcon, { className: "size-12 shrink-0 text-orange-700" }),
                React.createElement("p", { className: "text-caption" },
                    React.createElement(Trans, null, "Doesn't work with Valve Matchmaking demos as voice data are not available!")))), title: React.createElement(Trans, { context: "Settings title" }, "Player voices") }));
}
//# sourceMappingURL=player-voices.js.map