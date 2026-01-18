import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { usePlaybackSettings } from './use-playback-settings';
export function LaunchParameters() {
    const { launchParameters, updateSettings } = usePlaybackSettings();
    const { t } = useLingui();
    const onBlur = async (event) => {
        const newLaunchParameters = event.target.value;
        if (newLaunchParameters !== launchParameters) {
            await updateSettings({
                launchParameters: event.target.value,
            });
        }
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(TextInput, { onBlur: onBlur, defaultValue: launchParameters, placeholder: t({
                context: 'Input placeholder',
                message: 'Launch parameters',
            }) }), description: React.createElement(Trans, null, "Additional launch parameters added to the game when it starts"), title: React.createElement(Trans, { context: "Settings title" }, "Launch parameters") }));
}
//# sourceMappingURL=launch-parameters.js.map