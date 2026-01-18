import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { PlayersColumnsVisibility } from './action-bar/columns-visibility';
import { RefreshPlayersButton } from './action-bar/refresh-button';
import { FuzzySearchTextInput } from './action-bar/fuzzy-search-text-input';
import { PlayersFilterDropdown } from './action-bar/players-filter-dropdown';
import { PlayerDetailsButton } from './action-bar/player-details-button';
export function PlayersActionBar() {
    return (React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(PlayerDetailsButton, null)), right: React.createElement(React.Fragment, null,
            React.createElement(RefreshPlayersButton, null),
            React.createElement(PlayersFilterDropdown, null),
            React.createElement(PlayersColumnsVisibility, null),
            React.createElement(FuzzySearchTextInput, null)) }));
}
//# sourceMappingURL=action-bar.js.map