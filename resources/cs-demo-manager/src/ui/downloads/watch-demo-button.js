import React from 'react';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { useGetDownloadedDemoPath } from 'csdm/ui/downloads/use-get-downloaded-demo-path';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { DownloadRequiredTooltip } from './dowload-required-tooltip';
import { isCounterStrikeStartable } from 'csdm/ui/hooks/use-counter-strike';
export function WatchDemoButton({ game, demoFileName, downloadStatus }) {
    const demoPath = useGetDownloadedDemoPath(demoFileName);
    const isDisabled = downloadStatus !== DownloadStatus.Downloaded;
    if (!isCounterStrikeStartable(game)) {
        return null;
    }
    if (isDisabled) {
        return (React.createElement(DownloadRequiredTooltip, null,
            React.createElement(WatchButton, { demoPath: demoPath, isDisabled: isDisabled, game: game })));
    }
    return React.createElement(WatchButton, { demoPath: demoPath, isDisabled: isDisabled, game: game });
}
//# sourceMappingURL=watch-demo-button.js.map