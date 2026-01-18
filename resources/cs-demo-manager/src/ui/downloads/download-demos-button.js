import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { Status } from 'csdm/common/types/status';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function DownloadDemosButton({ downloads, loadingStatus }) {
    const client = useWebSocketClient();
    const isDisabled = downloads.length === 0 || loadingStatus !== Status.Success;
    const showToast = useShowToast();
    const onClick = async () => {
        try {
            await client.send({
                name: RendererClientMessageName.AddDownloads,
                payload: downloads,
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
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Download all")));
}
//# sourceMappingURL=download-demos-button.js.map