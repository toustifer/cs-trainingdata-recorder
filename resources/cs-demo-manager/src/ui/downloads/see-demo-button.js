import React from 'react';
import { useNavigateToDemo } from 'csdm/ui/hooks/use-navigate-to-demo';
import { useDownloadFolderPathOrThrowError } from 'csdm/ui/settings/downloads/use-download-folder-path-or-throw-error';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { SeeDemoButton as CommonSeeDemoButton } from 'csdm/ui/components/buttons/see-demo-button';
import { DownloadRequiredTooltip } from './dowload-required-tooltip';
export function SeeDemoButton({ demoFileName, downloadStatus }) {
    const downloadFolderPath = useDownloadFolderPathOrThrowError();
    const navigateToDemo = useNavigateToDemo();
    const isDisabled = downloadStatus !== undefined && downloadStatus !== DownloadStatus.Downloaded;
    const onClick = () => {
        const demoPath = `${downloadFolderPath}/${demoFileName}.dem`;
        navigateToDemo(demoPath);
    };
    if (isDisabled) {
        return (React.createElement(DownloadRequiredTooltip, null,
            React.createElement(CommonSeeDemoButton, { onClick: onClick, isDisabled: isDisabled })));
    }
    return React.createElement(CommonSeeDemoButton, { onClick: onClick, isDisabled: isDisabled });
}
//# sourceMappingURL=see-demo-button.js.map