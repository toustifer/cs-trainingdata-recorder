import React from 'react';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { CopyNameItem } from 'csdm/ui/components/context-menu/items/copy-name-item';
import { NavigateToTeamItem } from 'csdm/ui/components/context-menu/items/navigate-to-team-item';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
export function TeamContextMenu({ teamNames }) {
    if (teamNames.length === 0) {
        return null;
    }
    const selectedTeamName = lastArrayItem(teamNames);
    return (React.createElement(ContextMenu, null,
        React.createElement(NavigateToTeamItem, { teamName: selectedTeamName }),
        React.createElement(CopyNameItem, { names: teamNames })));
}
//# sourceMappingURL=team-context-menu.js.map