import React, {} from 'react';
import { useLingui } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
export function WatchBeforeKillDelay({ title, description, defaultValue, onChange }) {
    const { t } = useLingui();
    const minSeconds = 0;
    const maxSeconds = 30;
    const onBlur = (event) => {
        const seconds = Number.parseInt(event.target.value);
        if (seconds !== defaultValue && seconds >= minSeconds && seconds <= maxSeconds) {
            onChange(seconds);
        }
    };
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(InputNumber, { onBlur: onBlur, placeholder: t({
                context: 'Input placeholder',
                message: 'Delay (seconds)',
            }), defaultValue: String(defaultValue), min: minSeconds, max: maxSeconds }), description: description, title: title }));
}
//# sourceMappingURL=watch-before-kill-delay.js.map