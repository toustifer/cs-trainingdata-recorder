import React from 'react';
import { Content } from 'csdm/ui/components/content';
import { MatchActionBar } from './action-bar/action-bar';
import { RoundsTimeline } from './scoreboard/rounds-timeline';
import { Scoreboard } from './scoreboard/scoreboard';
import { MatchInformation } from './scoreboard/match-information';
import { useCurrentMatch } from '../use-current-match';
import { MatchOverviewProvider } from './match-overview-provider';
export function MatchOverview() {
    const match = useCurrentMatch();
    return (React.createElement(MatchOverviewProvider, null, ({ tableTeamA, tableTeamB }) => {
        return (React.createElement(React.Fragment, null,
            React.createElement(MatchActionBar, null),
            React.createElement(Content, null,
                React.createElement(MatchInformation, { match: match }),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement(Scoreboard, { teamName: match.teamA.name, table: tableTeamA, score: match.teamA.score, scoreOppositeTeam: match.teamB.score }),
                    React.createElement(RoundsTimeline, { rounds: match.rounds }),
                    React.createElement(Scoreboard, { teamName: match.teamB.name, table: tableTeamB, score: match.teamB.score, scoreOppositeTeam: match.teamA.score })))));
    }));
}
//# sourceMappingURL=match-overview.js.map