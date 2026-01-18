import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
export function GameHeightInput({ height, onBlur }) {
    const { t } = useLingui();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(InputNumber, { onBlur: (event) => {
                const height = Number.parseInt(event.target.value);
                onBlur(isNaN(height) ? undefined : height);
            }, placeholder: t({
                context: 'Input placeholder',
                message: 'Height',
            }), defaultValue: height, min: 600 }), description: React.createElement(Trans, null, "Set the game height resolution."), title: React.createElement(Trans, { context: "Settings title" }, "Height") }));
}
//# sourceMappingURL=game-height-input.js.map