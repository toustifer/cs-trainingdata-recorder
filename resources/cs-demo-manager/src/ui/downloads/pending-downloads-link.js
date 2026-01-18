import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RoutePath } from 'csdm/ui/routes-paths';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { usePendingDownloadCount } from './pending/use-pending-download-count';
import { TabLinkNumberBadge } from 'csdm/ui/components/tabs/tab-link-number-badge';
export function PendingDownloadsLink() {
    const pendingDownloadCount = usePendingDownloadCount();
    return (React.createElement(TabLink, { url: RoutePath.DownloadsPending },
        React.createElement(Trans, { context: "Link" }, "Pending downloads"),
        React.createElement(TabLinkNumberBadge, { number: pendingDownloadCount })));
}
//# sourceMappingURL=pending-downloads-link.js.map