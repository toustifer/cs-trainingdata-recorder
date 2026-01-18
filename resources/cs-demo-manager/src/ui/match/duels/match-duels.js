import React from 'react';
import { Outlet } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { RoutePath } from 'csdm/ui/routes-paths';
export function MatchDuels() {
    return (React.createElement(React.Fragment, null,
        React.createElement(TabLinks, null,
            React.createElement(TabLink, { url: "" },
                React.createElement(Trans, { context: "Tab link" }, "Duels matrix")),
            React.createElement(TabLink, { url: RoutePath.MatchOpeningDuelsStats },
                React.createElement(Trans, { context: "Tab link" }, "Opening duels stats")),
            React.createElement(TabLink, { url: RoutePath.MatchOpeningDuelsMap },
                React.createElement(Trans, { context: "Tab link " }, "Opening duels map"))),
        React.createElement(Outlet, null)));
}
//# sourceMappingURL=match-duels.js.map