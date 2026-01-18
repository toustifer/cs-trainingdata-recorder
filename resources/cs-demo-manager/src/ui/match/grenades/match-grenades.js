import React from 'react';
import { GrenadesTabs } from './grenades-tabs';
import { Outlet } from 'react-router';
export function MatchGrenades() {
    return (React.createElement(React.Fragment, null,
        React.createElement(GrenadesTabs, null),
        React.createElement(Outlet, null)));
}
//# sourceMappingURL=match-grenades.js.map