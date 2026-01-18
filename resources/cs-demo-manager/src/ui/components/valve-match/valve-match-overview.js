import React from 'react';
import { TeamNumber } from 'csdm/common/types/counter-strike';
import { TeamText } from 'csdm/ui/components/team-text';
import { ValveMatchScoreboard } from 'csdm/ui/components/valve-match/valve-match-scoreboard';
import { PerformanceTimeline } from './player-performance/performance-timeline';
import { useIsDemoAnalysisInProgress } from 'csdm/ui/analyses/use-is-demo-analysis-in-progress';
import { Trans } from '@lingui/react/macro';
import { Spinner } from '../spinner';
function TeamScore({ teamName, teamScore, side }) {
    return (React.createElement("div", { className: "flex items-center" },
        React.createElement(TeamText, { className: "mr-4 text-title", teamNumber: side }, teamScore),
        React.createElement(TeamText, { className: "text-body-strong", teamNumber: side }, teamName)));
}
export function ValveMatchOverview({ match, demoPath, selectedPlayer, onPlayerSelected }) {
    const cts = match.players.filter((player) => player.startMatchTeamNumber === TeamNumber.CT);
    const terrorists = match.players.filter((player) => player.startMatchTeamNumber === TeamNumber.T);
    const isDemoAnalysisInProgress = useIsDemoAnalysisInProgress();
    return (React.createElement("div", { className: "flex w-full flex-col" },
        React.createElement("div", { className: "m-auto flex flex-col" },
            match.demoChecksum && isDemoAnalysisInProgress(match.demoChecksum) && (React.createElement("div", { className: "flex items-center gap-x-8 self-center" },
                React.createElement(Spinner, { size: 24 }),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Demo analysis in progress.")))),
            React.createElement("div", { className: "flex flex-col" },
                React.createElement(TeamScore, { teamScore: match.scoreTeamStartedCT, teamName: match.teamNameStartedCT, side: TeamNumber.CT }),
                React.createElement(ValveMatchScoreboard, { players: cts, onPlayerSelected: onPlayerSelected, demoPath: demoPath, game: match.game })),
            React.createElement("div", { className: "mt-12 flex flex-col" },
                React.createElement(TeamScore, { teamScore: match.scoreTeamStartedT, teamName: match.teamNameStartedT, side: TeamNumber.T }),
                React.createElement(ValveMatchScoreboard, { players: terrorists, onPlayerSelected: onPlayerSelected, demoPath: demoPath, game: match.game }))),
        React.createElement(PerformanceTimeline, { player: selectedPlayer, demoPath: demoPath, game: match.game })));
}
//# sourceMappingURL=valve-match-overview.js.map