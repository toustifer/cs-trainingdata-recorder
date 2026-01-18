import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { usePlaybackSettings } from './use-playback-settings';
export function HighlightsIncludeDamages() {
    const { highlights, updateSettings } = usePlaybackSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            highlights: {
                includeDamages: isChecked,
            },
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: highlights.includeDamages, onChange: onChange }), description: React.createElement("span", null,
            React.createElement(Trans, null, "Include health damages above 40HP that did not result into a player's kill in highlights")), title: React.createElement(Trans, { context: "Settings title" }, "Include damages (highlights)") }));
}
//# sourceMappingURL=highlights-include-damages.js.map