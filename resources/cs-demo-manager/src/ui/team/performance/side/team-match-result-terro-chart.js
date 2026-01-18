import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useTeam } from 'csdm/ui/team/use-team';
import { useMatchResultPie } from 'csdm/ui/hooks/chart/use-match-result-pie';
import { TeamChart, TeamChartPanel, TeamChartPanelHeader } from 'csdm/ui/team/performance/team-chart-panel';
export function TeamMatchResultTerroChart() {
    const { sideStats } = useTeam();
    const { ref } = useMatchResultPie({
        won: sideStats.matchWonCountStartedAsT,
        lost: sideStats.matchCountStartedAsT - sideStats.matchWonCountStartedAsT - sideStats.matchTieCountStartedAsT,
        tie: sideStats.matchTieCountStartedAsT,
    });
    if (sideStats.matchCountStartedAsT === 0) {
        return null;
    }
    return (React.createElement(TeamChartPanel, null,
        React.createElement(TeamChartPanelHeader, { title: React.createElement(Trans, { context: "Chart title" }, "Match results starting as Terrorist") }),
        React.createElement(TeamChart, { ref: ref })));
}
//# sourceMappingURL=team-match-result-terro-chart.js.map