import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { RoutePath } from 'csdm/ui/routes-paths';
export function PlayerTabs() {
    return (React.createElement(TabLinks, null,
        React.createElement(TabLink, { url: "" },
            React.createElement(Trans, { context: "Tab link" }, "Overview")),
        React.createElement(TabLink, { url: RoutePath.PlayerCharts },
            React.createElement(Trans, { context: "Tab link" }, "Graphs")),
        React.createElement(TabLink, { url: RoutePath.PlayerMaps },
            React.createElement(Trans, { context: "Tab link" }, "Maps")),
        React.createElement(TabLink, { url: RoutePath.PlayerHeatmap },
            React.createElement(Trans, { context: "Tab link" }, "Heatmap")),
        React.createElement(TabLink, { url: RoutePath.PlayerRank },
            React.createElement(Trans, { context: "Tab link" }, "Rank")),
        React.createElement(TabLink, { url: RoutePath.PlayerMatches },
            React.createElement(Trans, { context: "Tab link" }, "Matches"))));
}
//# sourceMappingURL=player-tabs.js.map