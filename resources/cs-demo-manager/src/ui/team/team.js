import React from 'react';
import { TeamTabs } from './team-tabs';
import { TeamActionBar } from './team-action-bar';
import { TeamLoader } from './team-loader';
export function Team() {
    return (React.createElement(React.Fragment, null,
        React.createElement(TeamTabs, null),
        React.createElement(TeamActionBar, null),
        React.createElement(TeamLoader, null)));
}
//# sourceMappingURL=team.js.map