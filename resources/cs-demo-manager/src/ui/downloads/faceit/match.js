import React from 'react';
import { Scoreboard } from './scoreboard';
import { FaceitDownloadsWarning } from 'csdm/ui/settings/downloads/faceit-downloads-warning';
export function Match({ match }) {
    return (React.createElement("div", { className: "flex flex-1 flex-col overflow-auto p-16" },
        React.createElement("div", { className: "mx-auto py-8" },
            React.createElement(FaceitDownloadsWarning, null)),
        React.createElement("div", { className: "my-8 flex flex-col gap-y-8" }, match.teams.map((team, index) => {
            const oppositeTeam = index === 0 && match.teams.length > 1 ? match.teams[1] : match.teams[0];
            const players = match.players.filter((player) => player.teamName === team.name);
            return (React.createElement(Scoreboard, { key: team.name, teamName: team.name, teamScore: team.score, scoreOppositeTeam: oppositeTeam.score, players: players }));
        }))));
}
//# sourceMappingURL=match.js.map