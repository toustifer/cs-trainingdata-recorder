import React from 'react';
import { useDownloadFolderPathOrThrowError } from 'csdm/ui/settings/downloads/use-download-folder-path-or-throw-error';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { RevealDemoInExplorerButton as RevealDemoInExplorerCommonButton } from 'csdm/ui/components/buttons/reveal-demo-in-explorer-button';
import { DownloadRequiredTooltip } from './dowload-required-tooltip';
export function RevealDemoInExplorerButton({ downloadStatus, demoFileName }) {
    const downloadFolderPath = useDownloadFolderPathOrThrowError();
    const demoPath = `${downloadFolderPath}/${demoFileName}.dem`;
    const isDisabled = downloadStatus !== DownloadStatus.Downloaded;
    if (isDisabled) {
        return (React.createElement(DownloadRequiredTooltip, null,
            React.createElement(RevealDemoInExplorerCommonButton, { demoPath: demoPath, isDisabled: isDisabled })));
    }
    return React.createElement(RevealDemoInExplorerCommonButton, { demoPath: demoPath, isDisabled: isDisabled });
}
//# sourceMappingURL=reveal-demo-in-explorer-button.js.map