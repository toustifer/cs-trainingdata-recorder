import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { abortDownload } from './pending-actions';
import { RemoveButton } from 'csdm/ui/components/buttons/remove-button';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function RemoveDownloadButton({ matchId }) {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const onClick = async () => {
        try {
            await client.send({
                name: RendererClientMessageName.AbortDownload,
                payload: matchId,
            });
            dispatch(abortDownload({ matchId }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'remove-download-error',
                type: 'error',
            });
        }
    };
    return React.createElement(RemoveButton, { onClick: onClick });
}
//# sourceMappingURL=remove-download-button.js.map