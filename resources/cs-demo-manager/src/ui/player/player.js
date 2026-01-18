import React from 'react';
import { PlayerActionBar } from './player-action-bar';
import { PlayerLoader } from './player-loader';
import { PlayerTabs } from './player-tabs';
export function Player() {
    return (React.createElement(React.Fragment, null,
        React.createElement(PlayerTabs, null),
        React.createElement(PlayerActionBar, null),
        React.createElement(PlayerLoader, null)));
}
//# sourceMappingURL=player.js.map