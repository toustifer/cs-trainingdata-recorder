import React, { useId } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { defaultSettings } from 'csdm/node/settings/default-settings';
import { EncoderSoftware } from 'csdm/common/types/encoder-software';
export function ConstantRateFactorInput() {
    const id = useId();
    const { settings, updateSettings } = useVideoSettings();
    const minValue = 0;
    const maxValue = 51;
    const defaultValue = defaultSettings.video.ffmpegSettings.constantRateFactor;
    // The -crf option is not passed to FFmpeg when custom output parameters are defined (users have full control)
    const isDisabled = settings.encoderSoftware === EncoderSoftware.FFmpeg && settings.ffmpegSettings.outputParameters !== '';
    const onBlur = async (event) => {
        const value = event.target.value.trim();
        let newConstantRateFactor = value === '' ? defaultValue : Number(value);
        if (newConstantRateFactor < 0) {
            newConstantRateFactor = defaultValue;
        }
        else if (newConstantRateFactor > maxValue) {
            newConstantRateFactor = maxValue;
        }
        event.target.value = newConstantRateFactor.toString();
        await updateSettings({
            ffmpegSettings: {
                constantRateFactor: newConstantRateFactor,
            },
        });
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id, helpTooltip: isDisabled ? (React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Trans, { context: "Tooltip" }, "This option is not available when using custom FFmpeg output parameters.")),
                React.createElement("p", null,
                    React.createElement(Trans, { context: "Tooltip" },
                        "You can still set the ",
                        React.createElement("code", null, "-crf"),
                        " parameter in your FFmpeg output parameters.")))) : (React.createElement(Trans, { context: "Tooltip" }, "Impact the video quality, from 0 to 51 with 0 for the best quality resulting in a larger file")) },
            React.createElement(Trans, { context: "Input label" }, "Quality")),
        React.createElement(InputNumber, { key: settings.ffmpegSettings.constantRateFactor, id: id, min: minValue, max: maxValue, onBlur: onBlur, defaultValue: settings.ffmpegSettings.constantRateFactor, placeholder: String(defaultValue), isDisabled: isDisabled })));
}
//# sourceMappingURL=constant-rate-factor-input.js.map