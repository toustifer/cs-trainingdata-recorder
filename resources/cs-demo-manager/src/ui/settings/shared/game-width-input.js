import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
export function GameWidthInput({ width, onBlur }) {
    const { t } = useLingui();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(InputNumber, { onBlur: (event) => {
                const width = Number.parseInt(event.target.value);
                onBlur(isNaN(width) ? undefined : width);
            }, placeholder: t({
                context: 'Input placeholder',
                message: 'Width',
            }), defaultValue: width, min: 800 }), description: React.createElement(Trans, null, "Set the game width resolution."), title: React.createElement(Trans, { context: "Settings title" }, "Width") }));
}
//# sourceMappingURL=game-width-input.js.map