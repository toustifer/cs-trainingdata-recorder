import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DownloadEntry } from 'csdm/ui/downloads/pending/download-entry';
import { useDownloads } from './use-downloads';
import { Message } from 'csdm/ui/components/message';
export function PendingDownloadsList() {
    const downloads = useDownloads();
    if (downloads.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No pending downloads.") });
    }
    return (React.createElement("div", { className: "flex flex-col gap-y-8 overflow-y-auto p-16" }, downloads.map((download) => (React.createElement(DownloadEntry, { key: download.matchId, download: download })))));
}
//# sourceMappingURL=pending-downloads-list.js.map