import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { ThemeName } from 'csdm/common/types/theme-name';
import { useUpdateSettings } from '../use-update-settings';
import { useThemeName } from './use-theme-name';
export function ThemeSelect() {
    const { t } = useLingui();
    const themeName = useThemeName();
    const updateSettings = useUpdateSettings();
    const labelPerTheme = {
        [ThemeName.Light]: t({
            context: 'Select option theme',
            message: 'Light',
        }),
        [ThemeName.Dark]: t({
            context: 'Select option theme',
            message: 'Dark',
        }),
    };
    const options = Object.values(ThemeName).map((themeName) => {
        return {
            value: themeName,
            label: labelPerTheme[themeName],
        };
    });
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Select, { options: options, value: themeName, onChange: async (selectedTheme) => {
                const className = selectedTheme === ThemeName.Dark ? 'dark' : '';
                document.documentElement.className = className;
                await updateSettings({
                    ui: {
                        theme: selectedTheme,
                    },
                });
            } }), description: React.createElement(Trans, null, "Application UI theme"), title: React.createElement(Trans, { context: "Settings title" }, "Theme") }));
}
//# sourceMappingURL=theme-select.js.map