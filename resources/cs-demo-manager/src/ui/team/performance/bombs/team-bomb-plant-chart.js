import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useTeam } from 'csdm/ui/team/use-team';
import { TeamChart, TeamChartPanel, TeamChartPanelHeader } from 'csdm/ui/team/performance/team-chart-panel';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { useChartColors } from 'csdm/ui/hooks/use-charts-colors';
import { getCssVariableValue } from 'csdm/ui/shared/get-css-variable-value';
import { renderToString } from 'react-dom/server';
export function TeamBombPlantChart() {
    const { bombsStats } = useTeam();
    const colors = useChartColors();
    const { t } = useLingui();
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: (parameters) => {
                const { percent, value, name } = parameters;
                const message = t({
                    message: `Bomb planted on ${name}`,
                    context: 'Chart tooltip',
                });
                return renderToString(React.createElement("div", { className: "flex flex-col gap-y-4" },
                    React.createElement("p", null, message),
                    React.createElement("p", { className: "text-center" },
                        React.createElement("span", { className: "text-body-strong" }, value),
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
                        const { percent, name } = parameters;
                        return `${name}\n${percent}%`;
                    },
                },
                data: [
                    {
                        name: 'A',
                        value: bombsStats.plantCountSiteA,
                        itemStyle: { color: getCssVariableValue('--color-bombsite-a') },
                    },
                    {
                        name: 'B',
                        value: bombsStats.plantCountSiteB,
                        itemStyle: { color: getCssVariableValue('--color-bombsite-b') },
                    },
                ].sort((resultA, resultB) => resultA.value - resultB.value),
            },
        ],
    };
    const { ref } = useChart({
        option,
    });
    return (React.createElement(TeamChartPanel, null,
        React.createElement(TeamChartPanelHeader, { title: React.createElement(Trans, { context: "Chart title" }, "Bomb plant repartition") }),
        React.createElement(TeamChart, { ref: ref })));
}
//# sourceMappingURL=team-bomb-plant-chart.js.map