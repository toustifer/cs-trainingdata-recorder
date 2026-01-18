import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { Spinner } from 'csdm/ui/components/spinner';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { ExpiredIcon } from 'csdm/ui/icons/expired-icon';
import { DownloadIcon } from 'csdm/ui/icons/download-icon';
import { CheckCircleIcon } from 'csdm/ui/icons/check-circle-icon';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { FileCorruptedIcon } from 'csdm/ui/icons/file-corrupted-icon';
export function MatchDownloadStatus({ status }) {
    const iconSize = 16;
    switch (status) {
        case DownloadStatus.Error:
            return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Download status" }, "Error on download") },
                React.createElement(ExclamationTriangleIcon, { width: iconSize, className: "text-red-400" })));
        case DownloadStatus.NotDownloaded:
            return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Download status" }, "Not downloaded") },
                React.createElement(DownloadIcon, { width: iconSize, className: "text-orange-400" })));
        case DownloadStatus.Downloading:
            return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Download status" }, "Downloading\u2026") },
                React.createElement(Spinner, { size: iconSize })));
        case DownloadStatus.Expired:
            return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Download status" }, "Expired") },
                React.createElement(ExpiredIcon, { width: iconSize, className: "text-orange-400" })));
        case DownloadStatus.Corrupted:
            return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Download status" }, "Corrupted") },
                React.createElement(FileCorruptedIcon, { width: iconSize, className: "text-orange-400" })));
        default:
            return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Download status" }, "Downloaded") },
                React.createElement(CheckCircleIcon, { width: iconSize, className: "text-green-400" })));
    }
}
//# sourceMappingURL=match-download-status.js.map