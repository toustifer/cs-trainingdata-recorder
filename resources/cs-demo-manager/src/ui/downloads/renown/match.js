import React from 'react';
import { Scoreboard } from './scoreboard';
export function Match({ match }) {
    const isOnLeetify = match.leetifyMatchUrl !== null;
    return (React.createElement("div", { className: "flex flex-1 flex-col overflow-auto p-16" },
        React.createElement("div", { className: "my-8 flex flex-col gap-y-8" },
            React.createElement(Scoreboard, { teamName: match.team1.name, teamScore: match.team1.score, scoreOppositeTeam: match.team2.score, players: match.players.filter((player) => player.teamName === 'team1'), isOnLeetify: isOnLeetify }),
            React.createElement(Scoreboard, { teamName: match.team2.name, teamScore: match.team2.score, scoreOppositeTeam: match.team1.score, players: match.players.filter((player) => player.teamName === 'team2'), isOnLeetify: isOnLeetify }))));
}
//# sourceMappingURL=match.js.map