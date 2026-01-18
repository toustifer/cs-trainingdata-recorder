import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { ErrorCode } from 'csdm/common/error-code';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function DownloadDemoButton({ download, status }) {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const onClick = async () => {
        try {
            await client.send({
                name: RendererClientMessageName.AddDownload,
                payload: download,
            });
        }
        catch (error) {
            let errorMessage;
            switch (error) {
                case ErrorCode.DownloadFolderNotDefined:
                    errorMessage = React.createElement(Trans, null, "A download folder is required. You can change it from settings.");
                    break;
                case ErrorCode.DownloadFolderNotExists:
                    errorMessage = React.createElement(Trans, null, "The download folder doesn't exist, please change it from the settings.");
                    break;
                case ErrorCode.MatchAlreadyInDownloadQueue:
                    errorMessage = React.createElement(Trans, null, "This match is already in pending downloads.");
                    break;
                case ErrorCode.MatchAlreadyDownloaded:
                    errorMessage = React.createElement(Trans, null, "This match is already in your downloads folder.");
                    break;
                case ErrorCode.DemoLinkExpired:
                    errorMessage = React.createElement(Trans, null, "The download link has expired.");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
            }
            showToast({
                id: 'download-demos-error',
                content: errorMessage,
                type: 'error',
            });
        }
    };
    let isDisabled = true;
    let tooltip;
    switch (status) {
        case DownloadStatus.Expired:
            tooltip = React.createElement(Trans, { context: "Tooltip" }, "Download link expired");
            break;
        case DownloadStatus.Corrupted:
            tooltip = React.createElement(Trans, { context: "Tooltip" }, "The demo is corrupted");
            isDisabled = false;
            break;
        case DownloadStatus.Downloading:
            tooltip = React.createElement(Trans, { context: "Tooltip" }, "Download in progress");
            break;
        case DownloadStatus.Downloaded:
            tooltip = React.createElement(Trans, { context: "Tooltip" }, "Demo already downloaded");
            break;
        case DownloadStatus.Error:
        case DownloadStatus.NotDownloaded:
            isDisabled = false;
            break;
    }
    let button = (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Download")));
    if (tooltip !== undefined) {
        button = (React.createElement(Tooltip, { content: tooltip, placement: "top" }, button));
    }
    return button;
}
//# sourceMappingURL=download-demo-button.js.map