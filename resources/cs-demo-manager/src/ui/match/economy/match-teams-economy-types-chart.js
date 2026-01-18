import React from 'react';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { TeamsRoundOutcomesByEconomyTypeChart } from 'csdm/ui/team/economy/teams-round-outcomes-by-economy-type-chart';
export function MatchTeamsEconomyTypesChart() {
    const match = useCurrentMatch();
    return React.createElement(TeamsRoundOutcomesByEconomyTypeChart, { economyStats: match.teamsEconomyStats });
}
//# sourceMappingURL=match-teams-economy-types-chart.js.map