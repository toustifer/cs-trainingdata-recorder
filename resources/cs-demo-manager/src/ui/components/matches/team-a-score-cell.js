import React from 'react';
import { getTeamScoreClassName } from 'csdm/ui/styles/get-team-score-class-name';
export function TeamAScoreCell({ data: match }) {
    return React.createElement("div", { className: getTeamScoreClassName(match.teamAScore, match.teamBScore) }, match.teamAScore);
}
//# sourceMappingURL=team-a-score-cell.js.map