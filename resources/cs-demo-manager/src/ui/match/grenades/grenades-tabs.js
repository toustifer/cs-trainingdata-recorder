import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { RoutePath } from 'csdm/ui/routes-paths';
export function GrenadesTabs() {
    return (React.createElement(TabLinks, null,
        React.createElement(TabLink, { url: "" },
            React.createElement(Trans, { context: "Tab link" }, "Stats")),
        React.createElement(TabLink, { url: RoutePath.MatchGrenadesFinder },
            React.createElement(Trans, { context: "Tab link grenades finder" }, "Finder"))));
}
//# sourceMappingURL=grenades-tabs.js.map