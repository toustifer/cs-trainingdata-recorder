import React from 'react';
import { TableStatusBar } from 'csdm/ui/components/table/status-bar/table-status-bar';
import { TableStatusBarSeparator } from 'csdm/ui/components/table/status-bar/table-status-bar-separator';
import { MatchWithCheaterIndicator } from './match-with-cheater-indicator';
import { MatchCount } from './match-count';
import { SelectedMatchCount } from './selected-match-count';
export function MatchesTableStatusBar() {
    return (React.createElement(TableStatusBar, null,
        React.createElement(MatchCount, null),
        React.createElement(TableStatusBarSeparator, null),
        React.createElement(SelectedMatchCount, null),
        React.createElement(TableStatusBarSeparator, null),
        React.createElement(MatchWithCheaterIndicator, null)));
}
//# sourceMappingURL=matches-status-bar.js.map