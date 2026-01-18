import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
export function HeightResolutionInput() {
    const { t } = useLingui();
    const { settings, updateSettings } = useVideoSettings();
    const minimalHeight = 600;
    const onBlur = async (event) => {
        let newHeight = Number(event.target.value);
        if (newHeight < minimalHeight) {
            newHeight = minimalHeight;
            event.target.value = newHeight.toString();
        }
        await updateSettings({
            height: newHeight,
        });
    };
    return (React.createElement(InputNumber, { key: settings.height, label: React.createElement(Trans, { context: "Input label" }, "Height"), min: minimalHeight, defaultValue: settings.height, onBlur: onBlur, placeholder: t({
            context: 'Input placeholder',
            message: 'Height',
        }) }));
}
//# sourceMappingURL=height-resolution-input.js.map