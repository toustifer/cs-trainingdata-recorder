import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { Select } from 'csdm/ui/components/inputs/select';
function useXAxisOptions() {
    const { t } = useLingui();
    const options = [
        {
            label: t({
                context: 'Select option time period',
                message: 'Day',
            }),
            value: 'day',
        },
        {
            label: t({
                context: 'Select option time period',
                message: 'Month',
            }),
            value: 'month',
        },
        {
            label: t({
                context: 'Select option time period',
                message: 'Year',
            }),
            value: 'year',
        },
        {
            label: t({
                context: 'Select option time period',
                message: 'Match',
            }),
            value: 'match',
        },
    ];
    return options;
}
export function XAxis({ selectedAxis, onChange }) {
    const options = useXAxisOptions();
    return (React.createElement("div", { className: "flex gap-x-12" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "X Axis")),
        React.createElement(Select, { options: options, value: selectedAxis, onChange: (axis) => {
                onChange(axis);
            } })));
}
//# sourceMappingURL=x-axis.js.map