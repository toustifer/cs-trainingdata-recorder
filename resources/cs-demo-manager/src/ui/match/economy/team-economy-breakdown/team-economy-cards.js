import React from 'react';
import { EconomyType } from 'csdm/common/types/counter-strike';
import { useTranslateEconomyType } from './use-translate-economy-type';
import { roundNumberPercentage } from 'csdm/common/math/round-number-percentage';
import { getEconomyTypeColor } from './get-economy-type-color';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Panel } from 'csdm/ui/components/panel';
function EconomyStats({ percentage, economyType }) {
    const { translateEconomyType } = useTranslateEconomyType();
    const color = getEconomyTypeColor(economyType);
    const economyTypeText = translateEconomyType(economyType);
    return (React.createElement("div", { className: "flex items-center" },
        React.createElement("div", { className: "mr-4 size-24 rounded", style: {
                backgroundColor: color,
            } }),
        React.createElement("div", null,
            React.createElement("p", { className: "selectable text-title" },
                percentage,
                "%"),
            React.createElement("p", { className: "selectable" }, economyTypeText))));
}
function TeamCard({ economyStats, roundCount }) {
    const pistolPercentage = roundNumberPercentage(economyStats.pistolCount / roundCount);
    const ecoPercentage = roundNumberPercentage(economyStats.ecoCount / roundCount);
    const semiBuyPercentage = roundNumberPercentage(economyStats.semiCount / roundCount);
    const forceBuyPercentage = roundNumberPercentage(economyStats.forceBuyCount / roundCount);
    const fullBuyPercentage = roundNumberPercentage(economyStats.fullCount / roundCount);
    return (React.createElement(Panel, { header: economyStats.teamName },
        React.createElement("div", { className: "flex gap-12" },
            React.createElement(EconomyStats, { economyType: EconomyType.Pistol, percentage: pistolPercentage }),
            React.createElement(EconomyStats, { economyType: EconomyType.Eco, percentage: ecoPercentage }),
            React.createElement(EconomyStats, { economyType: EconomyType.Semi, percentage: semiBuyPercentage }),
            React.createElement(EconomyStats, { economyType: EconomyType.ForceBuy, percentage: forceBuyPercentage }),
            React.createElement(EconomyStats, { economyType: EconomyType.Full, percentage: fullBuyPercentage }))));
}
export function TeamEconomyCards() {
    const match = useCurrentMatch();
    const economyStatsTeamA = match.teamsEconomyStats.find((stats) => stats.teamName === match.teamA.name);
    const economyStatsTeamB = match.teamsEconomyStats.find((stats) => stats.teamName === match.teamB.name);
    if (!economyStatsTeamA || !economyStatsTeamB) {
        return null;
    }
    return (React.createElement("div", { className: "flex justify-around" },
        React.createElement(TeamCard, { economyStats: economyStatsTeamA, roundCount: match.rounds.length }),
        React.createElement(TeamCard, { economyStats: economyStatsTeamB, roundCount: match.rounds.length })));
}
//# sourceMappingURL=team-economy-cards.js.map