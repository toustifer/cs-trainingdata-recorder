import React from 'react';
import { useNavigateToTeam } from 'csdm/ui/hooks/use-navigate-to-team';
import { DetailsItem } from './details-item';
export function NavigateToTeamItem({ teamName }) {
    const navigateToTeam = useNavigateToTeam();
    const onClick = () => {
        navigateToTeam(teamName);
    };
    return React.createElement(DetailsItem, { onClick: onClick });
}
//# sourceMappingURL=navigate-to-team-item.js.map