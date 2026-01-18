import React, {} from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useChart } from 'csdm/ui/hooks/use-chart';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useCurrentRound } from './use-current-round';
import { Panel } from 'csdm/ui/components/panel';
import { useChartColors } from 'csdm/ui/hooks/use-charts-colors';
import { useTranslateEconomyType } from 'csdm/ui/match/economy/team-economy-breakdown/use-translate-economy-type';
import { useFormatMoney } from 'csdm/ui/hooks/use-format-money';
function useEconomySeriesData() {
    const match = useCurrentMatch();
    const round = useCurrentRound();
    const playerNamesTeamA = [];
    const cashDataTeamA = [];
    const cashSpentDataTeamA = [];
    const equipmentValueDataTeamA = [];
    const playerNamesTeamB = [];
    const cashDataTeamB = [];
    const cashSpentDataTeamB = [];
    const equipmentValueDataTeamB = [];
    for (const player of match.players) {
        const playerEconomy = match.playersEconomies.find((playerEconomy) => {
            return playerEconomy.roundNumber === round.number && playerEconomy.playerSteamId === player.steamId;
        });
        if (playerEconomy === undefined) {
            continue;
        }
        if (player.teamName === match.teamA.name) {
            playerNamesTeamA.push(player.name);
            cashDataTeamA.push(playerEconomy.startMoney);
            cashSpentDataTeamA.push(playerEconomy.moneySpent);
            equipmentValueDataTeamA.push(playerEconomy.equipmentValue);
        }
        else {
            playerNamesTeamB.push(player.name);
            cashDataTeamB.push(playerEconomy.startMoney);
            cashSpentDataTeamB.push(playerEconomy.moneySpent);
            equipmentValueDataTeamB.push(playerEconomy.equipmentValue);
        }
    }
    const max = Math.max(...cashDataTeamA, ...cashDataTeamB, ...cashSpentDataTeamA, ...cashSpentDataTeamB, ...equipmentValueDataTeamA, ...equipmentValueDataTeamB);
    return {
        playerNamesTeamA,
        playerNamesTeamB,
        cashDataTeamA,
        cashDataTeamB,
        cashSpentDataTeamA,
        cashSpentDataTeamB,
        equipmentValueDataTeamA,
        equipmentValueDataTeamB,
        max,
    };
}
function useEconomyChartOption() {
    const { t } = useLingui();
    const colors = useChartColors();
    const { playerNamesTeamA, playerNamesTeamB, cashDataTeamA, cashDataTeamB, cashSpentDataTeamA, cashSpentDataTeamB, equipmentValueDataTeamA, equipmentValueDataTeamB, max, } = useEconomySeriesData();
    const label = {
        show: true,
        color: colors.labelTextColor,
    };
    const commonOption = {
        color: ['#12805c', '#0d66d0', '#cb6f10'],
        grid: {
            top: 8,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none',
            },
            backgroundColor: colors.tooltipBackgroundColor,
            borderColor: colors.tooltipBorderColor,
            textStyle: {
                color: colors.tooltipTextColor,
            },
        },
        legend: {
            top: 'bottom',
            textStyle: {
                color: colors.legendTextColor,
            },
        },
        xAxis: {
            type: 'value',
            max,
            name: '$',
            axisLabel: label,
            nameTextStyle: {
                color: colors.axisColor,
            },
            splitLine: {
                lineStyle: {
                    color: colors.splitLineColor,
                },
            },
        },
        yAxis: {
            type: 'category',
            axisLabel: label,
            axisLine: {
                lineStyle: {
                    color: colors.axisColor,
                },
            },
        },
    };
    const barSeries = {
        type: 'bar',
        label,
        emphasis: {
            focus: 'series',
        },
    };
    const cashSeries = {
        ...barSeries,
        name: t `Cash`,
    };
    const cashSpentSeries = {
        ...barSeries,
        name: t `Cash spent`,
    };
    const equipmentValueSeries = {
        ...barSeries,
        name: t `Equipment value`,
    };
    const labelTeamA = {
        ...label,
        position: 'left',
    };
    const chartOptionTeamA = {
        ...commonOption,
        xAxis: {
            ...commonOption.xAxis,
            inverse: true,
        },
        yAxis: {
            ...commonOption.yAxis,
            type: 'category',
            position: 'right',
            data: playerNamesTeamA,
        },
        series: [
            {
                ...cashSeries,
                label: labelTeamA,
                data: cashDataTeamA,
            },
            {
                ...cashSpentSeries,
                label: labelTeamA,
                data: cashSpentDataTeamA,
            },
            {
                ...equipmentValueSeries,
                label: labelTeamA,
                data: equipmentValueDataTeamA,
            },
        ],
    };
    const labelTeamB = {
        ...cashSeries.label,
        position: 'right',
    };
    const chartOptionTeamB = {
        ...commonOption,
        yAxis: {
            ...commonOption.yAxis,
            position: 'left',
            type: 'category',
            data: playerNamesTeamB,
        },
        series: [
            {
                ...cashSeries,
                label: labelTeamB,
                data: cashDataTeamB,
            },
            {
                ...cashSpentSeries,
                label: labelTeamB,
                data: cashSpentDataTeamB,
            },
            {
                ...equipmentValueSeries,
                label: labelTeamB,
                data: equipmentValueDataTeamB,
            },
        ],
    };
    const chartHeightTeamA = playerNamesTeamA.length * 100;
    const chartHeightTeamB = playerNamesTeamB.length * 100;
    return {
        chartOptionTeamA,
        chartOptionTeamB,
        chartHeightTeamA,
        chartHeightTeamB,
    };
}
function TeamEconomyOverviewRow({ label, value }) {
    const formatMoney = useFormatMoney();
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement("p", null, label),
        React.createElement("p", { className: "text-body-strong" }, typeof value === 'number' ? formatMoney(value) : value)));
}
function TeamEconomyOverview({ name, equipmentValue, startMoney, moneySpent, economyType }) {
    const { translateEconomyType } = useTranslateEconomyType();
    return (React.createElement("div", null,
        React.createElement("p", { className: "text-subtitle" }, name),
        React.createElement(TeamEconomyOverviewRow, { label: React.createElement(Trans, null, "Cash"), value: startMoney }),
        React.createElement(TeamEconomyOverviewRow, { label: React.createElement(Trans, null, "Equipment value"), value: equipmentValue }),
        React.createElement(TeamEconomyOverviewRow, { label: React.createElement(Trans, null, "Cash spent"), value: moneySpent }),
        React.createElement(TeamEconomyOverviewRow, { label: React.createElement(Trans, null, "Economy"), value: translateEconomyType(economyType) })));
}
export function PlayersEconomyChart() {
    const match = useCurrentMatch();
    const round = useCurrentRound();
    const { chartOptionTeamA, chartOptionTeamB, chartHeightTeamA, chartHeightTeamB } = useEconomyChartOption();
    const { ref: chartRefTeamA } = useChart({ option: chartOptionTeamA });
    const { ref: chartRefTeamB } = useChart({ option: chartOptionTeamB });
    return (React.createElement(Panel, { header: React.createElement(Trans, null, "Teams economy") },
        React.createElement("div", { className: "flex w-full justify-between" },
            React.createElement(TeamEconomyOverview, { name: match.teamA.name, startMoney: round.teamAStartMoney, moneySpent: round.teamAMoneySpent, equipmentValue: round.teamAEquipmentValue, economyType: round.teamAEconomyType }),
            React.createElement(TeamEconomyOverview, { name: match.teamB.name, startMoney: round.teamBStartMoney, moneySpent: round.teamBMoneySpent, equipmentValue: round.teamBEquipmentValue, economyType: round.teamBEconomyType })),
        React.createElement("div", { className: "flex" },
            React.createElement("div", { className: "w-1/2", style: {
                    height: chartHeightTeamA,
                }, ref: chartRefTeamA }),
            React.createElement("div", { className: "w-1/2", style: {
                    height: chartHeightTeamB,
                }, ref: chartRefTeamB }))));
}
//# sourceMappingURL=players-economy-chart.js.map