import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
export function WidthResolutionInput() {
    const { t } = useLingui();
    const { settings, updateSettings } = useVideoSettings();
    const minimalWidth = 800;
    const onBlur = async (event) => {
        let newWidth = Number(event.target.value);
        if (newWidth < minimalWidth) {
            newWidth = minimalWidth;
            event.target.value = newWidth.toString();
        }
        await updateSettings({
            width: newWidth,
        });
    };
    return (React.createElement(InputNumber, { key: settings.width, label: React.createElement(Trans, { context: "Input label" }, "Width"), onBlur: onBlur, defaultValue: settings.width, min: minimalWidth, placeholder: t({
            context: 'Input placeholder',
            message: 'Width',
        }) }));
}
//# sourceMappingURL=width-resolution-input.js.map