import React from 'react';
import { TeamText } from 'csdm/ui/components/team-text';
export function MatchScore({ score, teamNumber }) {
    if (teamNumber === undefined) {
        return React.createElement("p", { className: "text-body-strong" }, score);
    }
    return (React.createElement(TeamText, { className: "text-body-strong", teamNumber: teamNumber }, score));
}
//# sourceMappingURL=match-score.js.map