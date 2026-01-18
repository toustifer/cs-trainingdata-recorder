import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { TeamNumber } from 'csdm/common/types/counter-strike';
import { SideSelect } from 'csdm/ui/components/inputs/select/side-select';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { roundNumberPercentage } from 'csdm/common/math/round-number-percentage';
import { Section } from 'csdm/ui/components/section';
function LegendItem({ className, label }) {
    return (React.createElement("div", { className: "flex items-center gap-x-4" },
        React.createElement("div", { className: clsx('h-16 w-32', className) }),
        React.createElement("p", { className: "text-body-strong" }, label)));
}
function Bar({ max, value, colorClassName, tooltip }) {
    const height = value === 0 ? 20 : `${(value / max) * 100}%`;
    const className = value === 0 ? 'border border-gray-400' : colorClassName;
    return (React.createElement(Tooltip, { content: tooltip, delay: 0, placement: "top" },
        React.createElement("div", { className: clsx('flex w-32 animate-grow-height items-center justify-center transition-all duration-300', className), style: { height } },
            React.createElement("span", { className: clsx('text-white', {
                    '-rotate-90': value.toString().length > 3,
                }) },
                max === 0 ? '-' : value,
                ' '))));
}
function Bars({ total, won, lost, label }) {
    const wonPercentage = total === 0 ? 0 : roundNumberPercentage(won / total);
    return (React.createElement("div", { className: "mt-8 flex flex-col gap-y-4 rounded-4 border border-gray-300 bg-gray-100 p-4" },
        React.createElement(Tooltip, { content: React.createElement(Trans, null, "Won percentage"), delay: 0 },
            React.createElement("p", { className: "text-center text-subtitle" }, total === 0 ? '-' : `${wonPercentage}%`)),
        React.createElement("div", { className: "mt-auto flex h-[200px] items-end" },
            React.createElement(Bar, { colorClassName: "bg-blue-700", max: total, value: total, tooltip: React.createElement(Trans, null,
                    "Total: ",
                    total) }),
            React.createElement(Bar, { colorClassName: "bg-green-700", tooltip: React.createElement(Trans, null,
                    "Won: ",
                    won), max: total, value: won }),
            React.createElement(Bar, { colorClassName: "bg-red-700", tooltip: React.createElement(Trans, null,
                    "Lost: ",
                    lost), max: total, value: lost })),
        React.createElement("p", { className: "text-center text-body-strong" }, label)));
}
function TeamChart({ teamName, economyStats, sides, showTeamName = true }) {
    const isAllSides = sides.length === 0;
    const labels = {
        eco: React.createElement(Trans, { context: "Economy type" }, "Eco"),
        pistol: React.createElement(Trans, { context: "Economy type" }, "Pistol"),
        semi: React.createElement(Trans, { context: "Economy type" }, "Semi"),
        forceBuy: React.createElement(Trans, { context: "Economy type" }, "Force-buy"),
        full: React.createElement(Trans, { context: "Economy type" }, "Full"),
    };
    const types = ['pistol', 'eco', 'semi', 'forceBuy', 'full'];
    return (React.createElement("div", { className: "flex h-auto flex-col" },
        React.createElement("div", { className: "flex gap-x-16" },
            showTeamName && React.createElement("p", { className: "text-body-strong" }, teamName),
            React.createElement("div", { className: "flex gap-x-8" },
                React.createElement(LegendItem, { className: "bg-blue-700", label: React.createElement(Trans, null, "Total") }),
                React.createElement(LegendItem, { className: "bg-green-700", label: React.createElement(Trans, null, "Won") }),
                React.createElement(LegendItem, { className: "bg-red-700", label: React.createElement(Trans, null, "Lost") }))),
        React.createElement("div", { className: "flex gap-x-16" }, types.map((type) => {
            const total = isAllSides
                ? economyStats[`${type}Count`]
                : sides.includes(TeamNumber.CT)
                    ? economyStats[`${type}WonAsCtCount`] + economyStats[`${type}LostAsCtCount`]
                    : economyStats[`${type}WonAsTCount`] + economyStats[`${type}LostAsTCount`];
            const won = isAllSides
                ? economyStats[`${type}WonCount`]
                : sides.includes(TeamNumber.CT)
                    ? economyStats[`${type}WonAsCtCount`]
                    : economyStats[`${type}WonAsTCount`];
            const lost = isAllSides
                ? economyStats[`${type}LostCount`]
                : sides.includes(TeamNumber.CT)
                    ? economyStats[`${type}LostAsCtCount`]
                    : economyStats[`${type}LostAsTCount`];
            return React.createElement(Bars, { key: type, total: total, won: won, lost: lost, label: labels[type] });
        }))));
}
export function TeamsRoundOutcomesByEconomyTypeChart({ economyStats, showTeamName }) {
    const [selectedSides, setSelectedSides] = useState([]);
    if (economyStats.length === 0) {
        return null;
    }
    return (React.createElement(Section, { title: React.createElement(Trans, null, "Round outcomes by economy type") },
        React.createElement("div", { className: "my-12" },
            React.createElement(SideSelect, { selectedSides: selectedSides, onChange: (side) => {
                    setSelectedSides(side === undefined ? [] : [side]);
                }, direction: "horizontal" })),
        React.createElement("div", { className: "flex flex-wrap items-center gap-16" }, economyStats.map((stats) => {
            return (React.createElement(TeamChart, { key: stats.teamName, teamName: stats.teamName, economyStats: stats, sides: selectedSides, showTeamName: showTeamName }));
        }))));
}
//# sourceMappingURL=teams-round-outcomes-by-economy-type-chart.js.map