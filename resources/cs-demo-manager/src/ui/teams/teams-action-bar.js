import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { TeamsColumnsVisibility } from './action-bar/teams-columns-visibility';
import { RefreshTeamsButton } from './action-bar/refresh-teams-button';
import { FuzzySearchTextInput } from './action-bar/fuzzy-search-text-input';
import { TeamsFilterDropdown } from './action-bar/teams-filter-dropdown';
import { TeamDetailsButton } from './action-bar/team-details-button';
export function TeamsActionBar() {
    return (React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(TeamDetailsButton, null)), right: React.createElement(React.Fragment, null,
            React.createElement(RefreshTeamsButton, null),
            React.createElement(TeamsFilterDropdown, null),
            React.createElement(TeamsColumnsVisibility, null),
            React.createElement(FuzzySearchTextInput, null)) }));
}
//# sourceMappingURL=teams-action-bar.js.map