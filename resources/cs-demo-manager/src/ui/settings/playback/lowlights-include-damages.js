import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { usePlaybackSettings } from './use-playback-settings';
export function LowlightsIncludeDamages() {
    const { lowlights, updateSettings } = usePlaybackSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            lowlights: {
                includeDamages: isChecked,
            },
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: lowlights.includeDamages, onChange: onChange }), description: React.createElement("span", null,
            React.createElement(Trans, null, "Include health damages above 40HP that did not result into a player's death in lowlights")), title: React.createElement(Trans, { context: "Settings title" }, "Include damages (lowlights)") }));
}
//# sourceMappingURL=lowlights-include-damages.js.map