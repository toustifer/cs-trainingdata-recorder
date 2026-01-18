import React from 'react';
import { renderToString } from 'react-dom/server';
import { useLingui } from '@lingui/react/macro';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { useChartColors } from 'csdm/ui/hooks/use-charts-colors';
import { getCssVariableValue } from 'csdm/ui/shared/get-css-variable-value';
import { assertNever } from 'csdm/common/assert-never';
export function useMatchResultPie({ won, lost, tie }) {
    const colors = useChartColors();
    const { t } = useLingui();
    const translateResult = (result) => {
        switch (result) {
            case 'won':
                return t({
                    message: 'Won',
                    context: 'Match result',
                });
            case 'lost':
                return t({
                    message: 'Lost',
                    context: 'Match result',
                });
            case 'tie':
                return t({
                    message: 'Tie',
                    context: 'Match result',
                });
            default:
                return assertNever(result, `Unknown match result: ${result}`);
        }
    };
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (parameters) => {
                const { data, percent } = parameters;
                const message = translateResult(data.name);
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
                        const message = translateResult(data.name);
                        return `${message}\n${percent}%`;
                    },
                },
                data: [
                    {
                        name: 'won',
                        value: won,
                        itemStyle: { color: getCssVariableValue('--color-green-500') },
                    },
                    {
                        name: 'lost',
                        value: lost,
                        itemStyle: { color: getCssVariableValue('--color-red-500') },
                    },
                    {
                        name: 'tie',
                        value: tie,
                        itemStyle: { color: getCssVariableValue('--color-orange-500') },
                    },
                ].sort((resultA, resultB) => resultA.value - resultB.value),
            },
        ],
    };
    return useChart({
        option,
    });
}
//# sourceMappingURL=use-match-result-pie.js.map