import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { DownloadDemoFromShareCodeButton } from 'csdm/ui/downloads/download-demo-from-share-code-button';
import { RevealDownloadFolderInExplorerButton } from '../reveal-download-folder-in-explorer-button';
import { RemoveDownloadsButton } from './remove-downloads-button';
export function DownloadsActionBar() {
    return (React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(DownloadDemoFromShareCodeButton, null),
            React.createElement(RevealDownloadFolderInExplorerButton, null),
            React.createElement(RemoveDownloadsButton, null)) }));
}
//# sourceMappingURL=action-bar.js.map