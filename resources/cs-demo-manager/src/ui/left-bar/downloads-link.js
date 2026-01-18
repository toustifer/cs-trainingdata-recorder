import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DownloadIcon } from 'csdm/ui/icons/download-icon';
import { LeftBarLink } from './left-bar-link';
import { PendingDownloadsBadge } from './pending-downloads-badge';
import { RoutePath } from 'csdm/ui/routes-paths';
export function DownloadsLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement("div", { className: "relative size-full" },
            React.createElement(PendingDownloadsBadge, null),
            React.createElement(DownloadIcon, null)), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Downloads"), url: RoutePath.Downloads }));
}
//# sourceMappingURL=downloads-link.js.map