import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Button } from 'csdm/ui/components/buttons/button';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDownloads } from './use-downloads';
import { abortDownloads } from './pending-actions';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function RemoveDownloadsButton() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const downloads = useDownloads();
    const isDisabled = downloads.length <= 0;
    const showToast = useShowToast();
    const onClick = async () => {
        try {
            await client.send({
                name: RendererClientMessageName.AbortDownloads,
            });
            dispatch(abortDownloads());
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'remove-downloads-error',
                type: 'error',
            });
        }
    };
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Remove downloads")));
}
//# sourceMappingURL=remove-downloads-button.js.map