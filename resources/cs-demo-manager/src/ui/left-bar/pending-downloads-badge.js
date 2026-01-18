import React from 'react';
import { usePendingDownloadCount } from 'csdm/ui/downloads/pending/use-pending-download-count';
import { LeftBarBadge } from './left-bar-badge';
import { NumberBadge } from '../components/number-badge';
export function PendingDownloadsBadge() {
    const pendingDownloadCount = usePendingDownloadCount();
    return (React.createElement(LeftBarBadge, null,
        React.createElement(NumberBadge, { number: pendingDownloadCount })));
}
//# sourceMappingURL=pending-downloads-badge.js.map