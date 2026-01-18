import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { usePlaybackSettings } from './use-playback-settings';
export function FollowSymbolicLinks() {
    const { followSymbolicLinks, updateSettings } = usePlaybackSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            followSymbolicLinks: isChecked,
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: followSymbolicLinks, onChange: onChange }), description: React.createElement("p", null,
            React.createElement(Trans, null, "Follow symbolic links when looking for the Steam runtime script used to launch Counter-Strike.")), title: React.createElement(Trans, { context: "Settings title" }, "Follow symbolic Links") }));
}
//# sourceMappingURL=follow-symbolic-links.js.map