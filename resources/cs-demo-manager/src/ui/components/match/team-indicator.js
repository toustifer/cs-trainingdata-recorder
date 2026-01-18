import React from 'react';
import { getTeamColor } from 'csdm/ui/styles/get-team-color';
export function TeamIndicator({ teamNumber }) {
    const color = getTeamColor(teamNumber);
    return (React.createElement("div", { className: "flex size-8 self-center rounded-full", style: {
            backgroundColor: color,
        } }));
}
//# sourceMappingURL=team-indicator.js.map