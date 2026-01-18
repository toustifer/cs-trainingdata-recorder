import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { useSettingsOverlay } from 'csdm/ui/settings//use-settings-overlay';
import { SettingsCategory } from 'csdm/ui/settings//settings-category';
import { usePlaybackSettings } from './use-playback-settings';
export function UseHlae() {
    const { useHlae, updateSettings } = usePlaybackSettings();
    const { showCategory } = useSettingsOverlay();
    const onChange = async (isChecked) => {
        await updateSettings({
            useHlae: isChecked,
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: useHlae, onChange: onChange }), description: React.createElement(Trans, null,
            "Start Counter-Strike using HLAE configured in the",
            ' ',
            React.createElement("button", { className: "text-blue-500 underline", onClick: () => {
                    showCategory(SettingsCategory.Video);
                } }, "video settings")), title: React.createElement(Trans, { context: "Settings title" }, "Use HLAE") }));
}
//# sourceMappingURL=use-hlae.js.map