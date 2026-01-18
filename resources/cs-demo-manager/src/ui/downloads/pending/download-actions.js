import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SeeDemoButton } from 'csdm/ui/downloads/see-demo-button';
import { CheckCircleIcon } from 'csdm/ui/icons/check-circle-icon';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { ExpiredIcon as ClockIcon } from 'csdm/ui/icons/expired-icon';
import { PendingIcon } from 'csdm/ui/icons/pending-icon';
import { Progress } from 'csdm/ui/components/progress';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { useDownloadProgress } from './use-download-progress';
import { useDownloadStatus } from './use-download-status';
import { RemoveDownloadButton } from './remove-download-button';
import { RevealDemoInExplorerButton } from 'csdm/ui/downloads/reveal-demo-in-explorer-button';
import { FileCorruptedIcon } from 'csdm/ui/icons/file-corrupted-icon';
export function DownloadActions({ matchId, demoFileName }) {
    const progress = useDownloadProgress();
    const matchProgress = progress[matchId] ?? 0;
    const statusPerMatchId = useDownloadStatus();
    const status = statusPerMatchId[matchId] || DownloadStatus.NotDownloaded;
    let statusIcon = null;
    let bottomContent = null;
    switch (status) {
        case DownloadStatus.Downloading:
            bottomContent = React.createElement(Progress, { value: matchProgress * 100 });
            break;
        case DownloadStatus.Downloaded:
            statusIcon = React.createElement(CheckCircleIcon, { className: "w-16 text-green-400" });
            bottomContent = (React.createElement("div", { className: "flex gap-4" },
                React.createElement(SeeDemoButton, { demoFileName: demoFileName, downloadStatus: status }),
                React.createElement(RevealDemoInExplorerButton, { demoFileName: demoFileName, downloadStatus: status })));
            break;
        case DownloadStatus.Expired:
            statusIcon = React.createElement(ClockIcon, { className: "w-16 text-orange-400" });
            bottomContent = (React.createElement("p", null,
                React.createElement(Trans, null, "The download link has expired.")));
            break;
        case DownloadStatus.Corrupted:
            statusIcon = React.createElement(FileCorruptedIcon, { className: "w-16 text-orange-400" });
            bottomContent = (React.createElement("p", null,
                React.createElement(Trans, null, "The downloaded demo is corrupted. You can retry later.")));
            break;
        case DownloadStatus.Error:
            statusIcon = React.createElement(ExclamationTriangleIcon, { className: "w-16 text-red-400" });
            bottomContent = (React.createElement("p", null,
                React.createElement(Trans, null, "An error occurred while downloading the demo.")));
            break;
        default:
            statusIcon = React.createElement(PendingIcon, { className: "w-16 text-gray-900" });
    }
    return (React.createElement("div", { className: "flex h-full flex-1 flex-col items-end justify-between" },
        React.createElement("div", { className: "flex items-center gap-8" },
            statusIcon,
            React.createElement(RemoveDownloadButton, { matchId: matchId })),
        bottomContent));
}
//# sourceMappingURL=download-actions.js.map