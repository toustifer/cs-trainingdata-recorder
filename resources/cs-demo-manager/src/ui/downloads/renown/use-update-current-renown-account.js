import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { accountsUpdated } from './renown-actions';
export function useUpdateCurrentRenownAccount() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    return async (steamId) => {
        try {
            const accounts = await client.send({
                name: RendererClientMessageName.UpdateCurrentRenownAccount,
                payload: steamId,
            });
            dispatch(accountsUpdated({ accounts }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'update-current-renown-account-error',
                type: 'error',
            });
        }
    };
}
//# sourceMappingURL=use-update-current-renown-account.js.map