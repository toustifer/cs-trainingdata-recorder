import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SettingsEntry } from 'csdm/ui/settings/settings-entry';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
export function RecordingDeathNoticesDuration() {
    const { settings, updateSettings } = useVideoSettings();
    const { t } = useLingui();
    return (React.createElement(SettingsEntry, { interactiveComponent: React.createElement(InputNumber, { onBlur: (event) => {
                const duration = Number.parseInt(event.target.value);
                if (isNaN(duration)) {
                    return;
                }
                updateSettings({
                    deathNoticesDuration: duration,
                });
            }, placeholder: t({
                context: 'Input placeholder',
                message: 'Duration',
            }), defaultValue: settings.deathNoticesDuration, min: 0 }), description: React.createElement("p", null,
            React.createElement(Trans, null, "How long death notices are displayed during recording in seconds.")), title: React.createElement(Trans, { context: "Settings title" }, "Death notices duration") }));
}
//# sourceMappingURL=recording-death-notices-duration.js.map