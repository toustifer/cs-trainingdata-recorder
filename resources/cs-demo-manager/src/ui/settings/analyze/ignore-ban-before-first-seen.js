import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { useUpdateSettings } from '../use-update-settings';
import { useBanSettings } from '../bans/use-ban-settings';
export function ToggleIgnoreBanBeforeFirstSeen() {
    const updateSettings = useUpdateSettings();
    const { ignoreBanBeforeFirstSeen } = useBanSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: ignoreBanBeforeFirstSeen, onChange: async (isChecked) => {
                await updateSettings({
                    ban: {
                        ignoreBanBeforeFirstSeen: isChecked,
                    },
                });
            } }), description: React.createElement(Trans, null, "Bans that happened before the player was first seen in a match will be ignored."), title: React.createElement(Trans, null, "Ignore bans happened before first match") }));
}
//# sourceMappingURL=ignore-ban-before-first-seen.js.map