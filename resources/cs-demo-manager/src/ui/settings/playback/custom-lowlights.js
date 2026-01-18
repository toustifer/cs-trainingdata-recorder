import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { Cs2HighlightsWarning } from './cs2-highlights-warning';
import { usePlaybackSettings } from './use-playback-settings';
export function CustomLowlights() {
    const { useCustomLowlights, updateSettings } = usePlaybackSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            useCustomLowlights: isChecked,
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: useCustomLowlights, onChange: onChange }), description: React.createElement("div", { className: "flex flex-col" },
            React.createElement("span", null,
                React.createElement(Trans, null, "Use a custom lowlights algorithm to generate players lowlights")),
            React.createElement(Cs2HighlightsWarning, null)), title: React.createElement(Trans, { context: "Settings title" }, "Lowlights") }));
}
//# sourceMappingURL=custom-lowlights.js.map