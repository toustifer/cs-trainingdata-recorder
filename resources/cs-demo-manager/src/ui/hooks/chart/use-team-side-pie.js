import React from 'react';
import { renderToString } from 'react-dom/server';
import { useLingui } from '@lingui/react/macro';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { useChartColors } from 'csdm/ui/hooks/use-charts-colors';
import { getCssVariableValue } from 'csdm/ui/shared/get-css-variable-value';
export function useTeamSidePie({ valueCt, valueT, tooltipCt, tooltipT }) {
    const colors = useChartColors();
    const { t } = useLingui();
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (parameters) => {
                const { data, percent } = parameters;
                const message = data.name === 'ct' ? tooltipCt : tooltipT;
                return renderToString(React.createElement("div", { className: "flex flex-col gap-y-4" },
                    React.createElement("p", null, message),
                    React.createElement("p", { className: "text-center" },
                        React.createElement("span", { className: "text-body-strong" }, data.value),
                        " (",
                        percent,
                        "%)")));
            },
            backgroundColor: colors.tooltipBackgroundColor,
            borderColor: colors.tooltipBorderColor,
            textStyle: {
                color: colors.tooltipTextColor,
            },
        },
        series: [
            {
                type: 'pie',
                percentPrecision: 0,
                label: {
                    color: colors.labelTextColor,
                    fontSize: 16,
                    formatter: (parameters) => {
                        const { data, percent } = parameters;
                        const side = data.name === 'ct'
                            ? t({
                                message: 'CT',
                                context: 'Team side',
                            })
                            : t({
                                message: 'T',
                                context: 'Team side',
                            });
                        return `${side}\n${percent}%`;
                    },
                },
                data: [
                    {
                        name: 'ct',
                        value: valueCt,
                        itemStyle: { color: getCssVariableValue('--color-ct') },
                    },
                    {
                        name: 't',
                        value: valueT,
                        itemStyle: { color: getCssVariableValue('--color-terro') },
                    },
                ],
            },
        ],
    };
    return useChart({
        option,
    });
}
//# sourceMappingURL=use-team-side-pie.js.map