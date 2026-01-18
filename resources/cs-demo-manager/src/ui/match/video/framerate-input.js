import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { defaultSettings } from 'csdm/node/settings/default-settings';
export function FramerateInput() {
    const { t } = useLingui();
    const { settings, updateSettings } = useVideoSettings();
    const onBlur = async (event) => {
        let newFramerate = Number(event.target.value);
        if (newFramerate <= 0) {
            newFramerate = defaultSettings.video.framerate;
            event.target.value = newFramerate.toString();
        }
        await updateSettings({
            framerate: newFramerate,
        });
    };
    return (React.createElement(InputNumber, { key: settings.framerate, label: React.createElement(Trans, { context: "Input label" }, "Framerate"), min: 1, defaultValue: settings.framerate, onBlur: onBlur, placeholder: t({
            context: 'Input placeholder',
            message: 'Framerate',
        }) }));
}
//# sourceMappingURL=framerate-input.js.map