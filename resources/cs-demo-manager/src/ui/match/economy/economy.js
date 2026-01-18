import React from 'react';
import { TeamEquipmentValuesChart } from './team-equipment-values-chart';
import { TeamEconomyAdvantageChart } from './team-economy-advantage-chart';
import { Content } from 'csdm/ui/components/content';
import { TeamsEconomyBreakdownChart } from './team-economy-breakdown/team-economy-breakdown-chart';
import { MatchTeamsEconomyTypesChart } from './match-teams-economy-types-chart';
export function Economy() {
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col gap-12" },
            React.createElement(MatchTeamsEconomyTypesChart, null),
            React.createElement(TeamEquipmentValuesChart, null),
            React.createElement(TeamEconomyAdvantageChart, null),
            React.createElement(TeamsEconomyBreakdownChart, null))));
}
//# sourceMappingURL=economy.js.map