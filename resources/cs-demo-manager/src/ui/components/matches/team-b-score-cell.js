import React from 'react';
import { getTeamScoreClassName } from 'csdm/ui/styles/get-team-score-class-name';
export function TeamBScoreCell({ data: match }) {
    return React.createElement("div", { className: getTeamScoreClassName(match.teamBScore, match.teamAScore) }, match.teamBScore);
}
//# sourceMappingURL=team-b-score-cell.js.map