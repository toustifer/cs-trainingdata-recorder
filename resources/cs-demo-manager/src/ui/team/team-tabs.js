import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { RoutePath } from 'csdm/ui/routes-paths';
export function TeamTabs() {
    return (React.createElement(TabLinks, null,
        React.createElement(TabLink, { url: "" },
            React.createElement(Trans, { context: "Tab link" }, "Overview")),
        React.createElement(TabLink, { url: RoutePath.TeamMaps },
            React.createElement(Trans, { context: "Tab link" }, "Maps")),
        React.createElement(TabLink, { url: RoutePath.TeamHeatmap },
            React.createElement(Trans, { context: "Tab link" }, "Heatmap")),
        React.createElement(TabLink, { url: RoutePath.TeamPerformance },
            React.createElement(Trans, { context: "Tab link" }, "Performance")),
        React.createElement(TabLink, { url: RoutePath.TeamMatches },
            React.createElement(Trans, { context: "Tab link" }, "Matches"))));
}
//# sourceMappingURL=team-tabs.js.map