import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { TeamFilterDropdown } from './team-filter-dropdown';
import { TeamName } from './team-name';
export function TeamActionBar() {
    return React.createElement(ActionBar, { left: React.createElement(TeamName, null), right: React.createElement(TeamFilterDropdown, null) });
}
//# sourceMappingURL=team-action-bar.js.map