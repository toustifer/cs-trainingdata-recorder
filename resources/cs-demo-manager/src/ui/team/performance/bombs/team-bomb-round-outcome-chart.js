import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useTeam } from 'csdm/ui/team/use-team';
import { TeamChart, TeamChartPanel, TeamChartPanelHeader } from 'csdm/ui/team/performance/team-chart-panel';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { useChartColors } from 'csdm/ui/hooks/use-charts-colors';
import { getCssVariableValue } from 'csdm/ui/shared/get-css-variable-value';
import { renderToString } from 'react-dom/server';
function tooltipFormatter(parameters) {
    const { percent, value, name } = parameters;
    return renderToString(React.createElement("div", { className: "flex flex-col gap-y-4" },
        React.createElement("p", null, name),
        React.createElement("p", { className: "text-center" },
            React.createElement("span", { className: "text-body-strong" }, value),
            " (",
            percent,
            "%)")));
}
function labelFormatter(parameters) {
    const { percent, name } = parameters;
    return `${name}\n${percent}%`;
}
function buildChartOption({ colors, data }) {
    return {
        tooltip: {
            trigger: 'item',
            formatter: tooltipFormatter,
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
                    formatter: labelFormatter,
                },
                data,
            },
        ],
    };
}
export function TeamBombPlantRoundOutcomeChart() {
    const { bombsStats } = useTeam();
    const colors = useChartColors();
    const { t } = useLingui();
    const data = [
        {
            name: t({
                message: 'Won due to bomb explosion',
                context: 'Chart axis label',
            }),
            value: bombsStats.roundsWonDueToBombExplosion,
            itemStyle: { color: getCssVariableValue('--color-green-500') },
        },
        {
            name: t({
                message: 'Lost due to defusal',
                context: 'Chart axis label',
            }),
            value: bombsStats.roundsLostDueToDefusal,
            itemStyle: { color: getCssVariableValue('--color-red-500') },
        },
        {
            name: t({
                message: 'Won due to player deaths',
                context: 'Chart axis label',
            }),
            value: bombsStats.roundsWonByPlayerDeaths,
            itemStyle: { color: getCssVariableValue('--color-blue-500') },
        },
    ];
    const option = buildChartOption({ colors, data });
    const { ref } = useChart({ option });
    return (React.createElement(TeamChartPanel, null,
        React.createElement(TeamChartPanelHeader, { title: React.createElement(Trans, { context: "Chart title" }, "Bomb plant round outcome"), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Round outcome when the bomb was planted by the team") }),
        React.createElement(TeamChart, { ref: ref })));
}
export function TeamEnemyBombPlantRoundOutcomeChart() {
    const { bombsStats } = useTeam();
    const colors = useChartColors();
    const { t } = useLingui();
    const data = [
        {
            name: t({
                message: 'Won due to defusal',
                context: 'Chart axis label',
            }),
            value: bombsStats.roundsWonDueToDefusal,
            itemStyle: { color: getCssVariableValue('--color-green-500') },
        },
        {
            name: t({
                message: 'Lost due to bomb explosion',
                context: 'Chart axis label',
            }),
            value: bombsStats.roundsLostDueToBombExplosion,
            itemStyle: { color: getCssVariableValue('--color-red-500') },
        },
        {
            name: t({
                message: 'Lost due to player deaths',
                context: 'Chart axis label',
            }),
            value: bombsStats.roundsLostDueToPlayerDeaths,
            itemStyle: { color: getCssVariableValue('--color-orange-500') },
        },
    ];
    const option = buildChartOption({ colors, data });
    const { ref } = useChart({ option });
    return (React.createElement(TeamChartPanel, null,
        React.createElement(TeamChartPanelHeader, { title: React.createElement(Trans, { context: "Chart title" }, "Enemy bomb plant round outcome"), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Round outcome when the bomb was planted by the enemy team") }),
        React.createElement(TeamChart, { ref: ref })));
}
//# sourceMappingURL=team-bomb-round-outcome-chart.js.map