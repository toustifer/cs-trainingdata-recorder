import React from 'react';
import { Outlet } from 'react-router';
import { RoutePath } from 'csdm/ui/routes-paths';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { PendingDownloadsLink } from './pending-downloads-link';
export function Downloads() {
    return (React.createElement(React.Fragment, null,
        React.createElement(TabLinks, null,
            React.createElement(TabLink, { url: "" }, "Valve"),
            React.createElement(TabLink, { url: RoutePath.DownloadsFaceit }, "FACEIT"),
            React.createElement(TabLink, { url: RoutePath.DownloadsRenown }, "Renown"),
            React.createElement(TabLink, { url: RoutePath.Downloads5EPlay }, "5EPlay"),
            React.createElement(PendingDownloadsLink, null)),
        React.createElement(Outlet, null)));
}
//# sourceMappingURL=downloads.js.map