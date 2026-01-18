import React from 'react';
import { Content } from 'csdm/ui/components/content';
import { PlayerWinRatePanel } from 'csdm/ui/player/overview/player-win-rate-panel';
import { PlayerMultiKillsPanel } from 'csdm/ui/player/overview/player-multi-kills-panel';
import { PlayerLastMatches } from 'csdm/ui/player/overview/player-last-matches';
import { PlayerObjectivesPanel } from './player-objectives-panel';
import { MatchmakingPanel } from './matchmaking-panel';
import { VacPanel } from './vac-panel';
import { KillsPanel } from 'csdm/ui/components/panels/kills-panel';
import { usePlayer } from '../use-player';
import { KastPanel } from 'csdm/ui/components/panels/kast-panel';
import { HltvRating2Panel } from 'csdm/ui/components/panels/hltv-rating-2-panel';
import { HeadshotPanel } from 'csdm/ui/components/panels/headshot-panel';
import { AverageDamagesPerRoundPanel } from 'csdm/ui/components/panels/average-damages-per-round-panel';
import { RoundsPanel } from 'csdm/ui/components/panels/rounds-panel';
import { KillDeathRatioPanel } from 'csdm/ui/components/panels/kill-death-ratio-panel';
import { AverageKillsPerRoundPanel } from 'csdm/ui/components/panels/average-kills-per-round-panel';
import { AverageDeathsPerRoundPanel } from 'csdm/ui/components/panels/average-deaths-per-round-panel';
import { PlayerClutches } from 'csdm/ui/player/overview/player-clutches';
import { HltvRatingPanel } from 'csdm/ui/components/panels/hltv-rating-panel';
import { PlayerCommentInput } from './player-comment-input';
import { PlayerUtilitiesPanel } from './player-utilities-panel';
import { PlayerOpeningDuelsStats } from './player-opening-duels-panel';
export function PlayerOverview() {
    const { killDeathRatio, killCount, deathCount, assistCount, wallbangKillCount, collateralKillCount, kast, hltvRating, hltvRating2, headshotCount, headshotPercentage, averageKillsPerRound, averageDeathsPerRound, averageDamagePerRound, roundCount, roundCountAsCt, roundCountAsT, averageBlindTime, averageEnemiesFlashed, averageHeGrenadeDamage, averageSmokesThrownPerMatch, } = usePlayer();
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col gap-y-12" },
            React.createElement("div", { className: "flex flex-wrap gap-8" },
                React.createElement(MatchmakingPanel, null),
                React.createElement(PlayerWinRatePanel, null),
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
                React.createElement(PlayerUtilitiesPanel, { averageBlindTime: averageBlindTime, averageEnemiesFlashed: averageEnemiesFlashed, averageHeGrenadeDamage: averageHeGrenadeDamage, averageSmokesThrownPerMatch: averageSmokesThrownPerMatch }),
                React.createElement(PlayerOpeningDuelsStats, null),
                React.createElement(RoundsPanel, { roundCount: roundCount, roundCountAsCt: roundCountAsCt, roundCountAsT: roundCountAsT }),
                React.createElement(PlayerMultiKillsPanel, null),
                React.createElement(PlayerObjectivesPanel, null),
                React.createElement(VacPanel, null)),
            React.createElement("div", null,
                React.createElement(PlayerClutches, null)),
            React.createElement("div", null,
                React.createElement(PlayerLastMatches, null)),
            React.createElement("div", { className: "h-max min-h-[128px] max-w-[512px]" },
                React.createElement(PlayerCommentInput, null)))));
}
//# sourceMappingURL=player-overview.js.map