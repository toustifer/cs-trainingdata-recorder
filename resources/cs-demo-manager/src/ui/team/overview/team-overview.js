import React from 'react';
import { Content } from 'csdm/ui/components/content';
import { TeamWinRatePanel } from 'csdm/ui/team/overview/team-win-rate-panel';
import { KillsPanel } from 'csdm/ui/components/panels/kills-panel';
import { useTeam } from '../use-team';
import { KastPanel } from 'csdm/ui/components/panels/kast-panel';
import { HltvRating2Panel } from 'csdm/ui/components/panels/hltv-rating-2-panel';
import { HeadshotPanel } from 'csdm/ui/components/panels/headshot-panel';
import { AverageDamagesPerRoundPanel } from 'csdm/ui/components/panels/average-damages-per-round-panel';
import { RoundsPanel } from 'csdm/ui/components/panels/rounds-panel';
import { KillDeathRatioPanel } from 'csdm/ui/components/panels/kill-death-ratio-panel';
import { AverageKillsPerRoundPanel } from 'csdm/ui/components/panels/average-kills-per-round-panel';
import { AverageDeathsPerRoundPanel } from 'csdm/ui/components/panels/average-deaths-per-round-panel';
import { HltvRatingPanel } from 'csdm/ui/components/panels/hltv-rating-panel';
import { TeamLastMatches } from './team-last-matches';
import { TeamClutches } from './team-clutches';
import { TeamMultiKillsPanel } from './team-multi-kills-panel';
import { TeamObjectivesPanel } from './team-objectives-panel';
export function TeamOverview() {
    const { killDeathRatio, killCount, deathCount, assistCount, wallbangKillCount, collateralKillCount, kast, hltvRating, hltvRating2, headshotCount, headshotPercentage, averageKillsPerRound, averageDeathsPerRound, averageDamagePerRound, roundCount, roundCountAsCt, roundCountAsT, } = useTeam();
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col gap-y-12" },
            React.createElement("div", { className: "flex flex-wrap gap-8" },
                React.createElement(TeamWinRatePanel, null),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(HltvRatingPanel, { hltvRating: hltvRating }),
                    React.createElement(HltvRating2Panel, { hltvRating2: hltvRating2 })),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(KastPanel, { kast: kast })),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(KillDeathRatioPanel, { killDeathRatio: killDeathRatio }),
                    React.createElement(AverageDamagesPerRoundPanel, { averageDamagePerRound: averageDamagePerRound })),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(AverageKillsPerRoundPanel, { averageKillsPerRound: averageKillsPerRound }),
                    React.createElement(AverageDeathsPerRoundPanel, { averageDeathsPerRound: averageDeathsPerRound })),
                React.createElement(HeadshotPanel, { headshotPercentage: headshotPercentage, headshotCount: headshotCount, killCount: killCount, assistCount: assistCount, deathCount: deathCount }),
                React.createElement(KillsPanel, { collateralKillCount: collateralKillCount, wallbangKillCount: wallbangKillCount }),
                React.createElement(RoundsPanel, { roundCount: roundCount, roundCountAsCt: roundCountAsCt, roundCountAsT: roundCountAsT }),
                React.createElement(TeamMultiKillsPanel, null),
                React.createElement(TeamObjectivesPanel, null)),
            React.createElement("div", null,
                React.createElement(TeamClutches, null)),
            React.createElement("div", null,
                React.createElement(TeamLastMatches, null)))));
}
//# sourceMappingURL=team-overview.js.map