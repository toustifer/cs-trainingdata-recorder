import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { usePlaybackSettings } from './use-playback-settings';
export function GameFullscreen() {
    const { fullscreen, updateSettings } = usePlaybackSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            fullscreen: isChecked,
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: fullscreen, onChange: onChange }), description: React.createElement(Trans, null, "Start the game in fullscreen mode"), title: React.createElement(Trans, { context: "Settings title" }, "Fullscreen") }));
}
//# sourceMappingURL=game-fullscreen.js.map