import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { useAnalyzeSettings } from './use-analyze-settings';
import { useUpdateSettings } from '../use-update-settings';
export function ToggleAnalyzePositions() {
    const updateSettings = useUpdateSettings();
    const { analyzePositions } = useAnalyzeSettings();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(Switch, { isChecked: analyzePositions, onChange: async (isChecked) => {
                await updateSettings({
                    analyze: {
                        analyzePositions: isChecked,
                    },
                });
            } }), description: React.createElement(Trans, null, "Analyze player/grenade positions during analysis. Positions are required only for the 2D viewer. When enabled it increases time to insert matches into database and disk space usage."), title: React.createElement(Trans, null, "Analyze player/grenade positions") }));
}
//# sourceMappingURL=toggle-analyze-positions.js.map