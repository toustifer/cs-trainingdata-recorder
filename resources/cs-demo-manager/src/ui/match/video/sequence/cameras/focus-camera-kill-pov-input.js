import React, { useId } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
export function KillFocusCameraPovSelect({ pov, onPovChange, beforeKillDelaySeconds, onBeforeKillDelaySecondsChange, }) {
    const { t } = useLingui();
    const id = useId();
    const options = [
        {
            value: 'killer',
            label: t({
                context: 'Select option',
                message: 'Killer',
            }),
        },
        {
            value: 'victim',
            label: t({
                context: 'Select option',
                message: 'Victim',
            }),
        },
    ];
    const hasPovSelected = pov !== undefined;
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement("div", { className: "flex gap-x-8" },
                React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Focus the camera on the killer or victim a few seconds before each kill"), isChecked: hasPovSelected, onChange: (event) => {
                        if (event.target.checked) {
                            onPovChange('killer');
                        }
                        else {
                            onPovChange(undefined);
                        }
                    } })),
            React.createElement("div", { className: "flex items-center gap-x-12" },
                React.createElement(Select, { options: options, isDisabled: !hasPovSelected, value: pov, onChange: (pov) => {
                        onPovChange(pov);
                    } }),
                React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(InputLabel, { htmlFor: id },
                        React.createElement(Trans, { context: "Input label" }, "Seconds")),
                    React.createElement("div", { className: "w-[5rem]" },
                        React.createElement(InputNumber, { id: id, min: 1, max: 30, isDisabled: !hasPovSelected, placeholder: String(1), defaultValue: beforeKillDelaySeconds, onChange: (event) => {
                                const input = event.target;
                                onBeforeKillDelaySecondsChange(Number(input.value));
                            } })))))));
}
//# sourceMappingURL=focus-camera-kill-pov-input.js.map