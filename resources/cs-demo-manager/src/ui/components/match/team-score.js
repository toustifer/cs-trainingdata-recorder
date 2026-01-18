import React from 'react';
import clsx from 'clsx';
import { getTeamScoreClassName } from 'csdm/ui/styles/get-team-score-class-name';
export function TeamScore({ teamName, teamScore, scoreOppositeTeam }) {
    return (React.createElement("div", { className: "flex items-center" },
        React.createElement("p", { className: clsx('text-title', getTeamScoreClassName(teamScore, scoreOppositeTeam)) }, teamScore),
        React.createElement("p", { className: "ml-4 text-body-strong" }, teamName)));
}
//# sourceMappingURL=team-score.js.map