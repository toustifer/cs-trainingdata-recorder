import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useTeam } from 'csdm/ui/team/use-team';
import { useTeamSidePie } from 'csdm/ui/hooks/chart/use-team-side-pie';
import { TeamChart, TeamChartPanel, TeamChartPanelHeader } from 'csdm/ui/team/performance/team-chart-panel';
export function TeamSideMatchChart() {
    const { sideStats } = useTeam();
    const { t } = useLingui();
    const { ref } = useTeamSidePie({
        valueCt: sideStats.matchCountStartedAsCt,
        valueT: sideStats.matchCountStartedAsT,
        tooltipCt: t({
            message: 'Matches started as CT',
            context: 'Chart tooltip',
        }),
        tooltipT: t({
            message: 'Matches started as T',
            context: 'Chart tooltip',
        }),
    });
    return (React.createElement(TeamChartPanel, null,
        React.createElement(TeamChartPanelHeader, { title: React.createElement(Trans, { context: "Chart title" }, "Starting side distribution") }),
        React.createElement(TeamChart, { ref: ref })));
}
//# sourceMappingURL=team-side-match-stats.js.map