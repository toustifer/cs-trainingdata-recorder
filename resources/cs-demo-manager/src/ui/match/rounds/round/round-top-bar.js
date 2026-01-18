import React from 'react';
import { useCurrentRound } from './use-current-round';
import { Trans } from '@lingui/react/macro';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { formatMillisecondsToTimer } from 'csdm/ui/shared/format-milliseconds-to-timer';
import { TeamText } from 'csdm/ui/components/team-text';
import { PlayDemoAtTickButton } from '../play-demo-at-tick-button';
export function RoundTopBar() {
    const round = useCurrentRound();
    const match = useCurrentMatch();
    return (React.createElement("div", { className: "relative" },
        React.createElement("div", { className: "flex w-full items-center border-b border-b-gray-300 px-12 py-8" },
            React.createElement("p", { className: "mr-auto" },
                "#",
                round.number),
            React.createElement("div", { className: "flex items-center gap-x-4" },
                React.createElement(TeamText, { teamNumber: round.teamASide }, match.teamA.name),
                React.createElement(TeamText, { teamNumber: round.teamASide, className: "text-body-strong" }, round.teamAScore)),
            React.createElement("p", { className: "mx-12" }, formatMillisecondsToTimer(round.duration)),
            React.createElement("div", { className: "flex items-center gap-x-4" },
                React.createElement(TeamText, { teamNumber: round.teamBSide, className: "text-body-strong" }, round.teamBScore),
                React.createElement(TeamText, { teamNumber: round.teamBSide }, match.teamB.name)),
            React.createElement("div", { className: "ml-auto" },
                React.createElement(PlayDemoAtTickButton, { demoPath: match.demoFilePath, game: match.game, tick: round.startTick, tooltip: React.createElement(Trans, { context: "Tooltip" }, "Watch round"), size: 20 })))));
}
//# sourceMappingURL=round-top-bar.js.map