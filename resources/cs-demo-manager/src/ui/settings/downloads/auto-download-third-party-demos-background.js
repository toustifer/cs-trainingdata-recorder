import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { useSettings } from '../use-settings';
import { useUpdateSettings } from '../use-update-settings';
export function AutoDownloadThirdPartyDemosBackground({ name, settingsKey }) {
    const { download } = useSettings();
    const updateSettings = useUpdateSettings();
    const onChange = async (isChecked) => {
        await updateSettings({
            download: {
                [settingsKey]: isChecked,
            },
        });
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: download[settingsKey], onChange: onChange }), description: React.createElement(Trans, null,
            "Automatically download ",
            name,
            " demos in the background."), title: React.createElement(Trans, { context: "Settings title" }, "Background download") }));
}
//# sourceMappingURL=auto-download-third-party-demos-background.js.map