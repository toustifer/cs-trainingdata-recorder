import React from 'react';
import { getTeamColor } from 'csdm/ui/styles/get-team-color';
export function TeamText({ children, teamNumber, className }) {
    return (React.createElement("span", { className: className, style: {
            color: getTeamColor(teamNumber),
        } }, children));
}
//# sourceMappingURL=team-text.js.map