import React from 'react';
import { Content } from 'csdm/ui/components/content';
import { TeamSideStats } from './side/team-side-stats';
import { TeamBombsStats } from './bombs/team-bombs-stats';
import { TeamsRoundOutcomesByEconomyTypeChart } from '../economy/teams-round-outcomes-by-economy-type-chart';
import { useTeam } from '../use-team';
export function TeamPerformance() {
    const { economyStats } = useTeam();
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col gap-16" },
            React.createElement(TeamSideStats, null),
            React.createElement(TeamsRoundOutcomesByEconomyTypeChart, { economyStats: [economyStats], showTeamName: false }),
            React.createElement(TeamBombsStats, null))));
}
//# sourceMappingURL=team-performance.js.map