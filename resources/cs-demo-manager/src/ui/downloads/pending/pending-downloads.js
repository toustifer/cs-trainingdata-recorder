import React from 'react';
import { DownloadsActionBar } from 'csdm/ui/downloads/pending/action-bar';
import { useDownloadFolderPath } from 'csdm/ui/settings/downloads/use-download-folder-path';
import { DownloadsFolderRequired } from '../downloads-folder-required';
import { PendingDownloadsList } from './pending-downloads-list';
export function PendingDownloads() {
    const downloadFolderPath = useDownloadFolderPath();
    if (downloadFolderPath === undefined) {
        return React.createElement(DownloadsFolderRequired, null);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(DownloadsActionBar, null),
        React.createElement(PendingDownloadsList, null)));
}
//# sourceMappingURL=pending-downloads.js.map