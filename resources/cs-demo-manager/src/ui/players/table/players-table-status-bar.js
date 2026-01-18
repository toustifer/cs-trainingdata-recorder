import React from 'react';
import { TableStatusBarSeparator } from 'csdm/ui/components/table/status-bar/table-status-bar-separator';
import { TableStatusBar } from 'csdm/ui/components/table/status-bar/table-status-bar';
import { PlayerCount } from './player-count';
import { SelectedPlayerCount } from './selected-player-count';
import { BansIndicators } from './bans-indicators';
export function PlayersTableStatusBar() {
    return (React.createElement(TableStatusBar, null,
        React.createElement(PlayerCount, null),
        React.createElement(TableStatusBarSeparator, null),
        React.createElement(SelectedPlayerCount, null),
        React.createElement(TableStatusBarSeparator, null),
        React.createElement(BansIndicators, null)));
}
//# sourceMappingURL=players-table-status-bar.js.map