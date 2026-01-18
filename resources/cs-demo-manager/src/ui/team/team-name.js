import React from 'react';
import { useUnsafeTeam } from './use-unsafe-team';
import { TeamIcon } from 'csdm/ui/icons/team-icon';
export function TeamName() {
    const team = useUnsafeTeam();
    if (!team) {
        return null;
    }
    return (React.createElement("div", { className: "flex items-center gap-x-4" },
        React.createElement(TeamIcon, { className: "size-24" }),
        React.createElement("p", { className: "text-body-strong" }, team.name)));
}
//# sourceMappingURL=team-name.js.map