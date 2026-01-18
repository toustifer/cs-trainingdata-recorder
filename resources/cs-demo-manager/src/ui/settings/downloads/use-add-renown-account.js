import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { accountAdded } from 'csdm/ui/downloads/renown/renown-actions';
export function useAddRenownAccount() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [isBusy, setIsBusy] = useState(false);
    const addAccount = async (steamId) => {
        try {
            if (steamId === '') {
                return false;
            }
            setIsBusy(true);
            const account = await client.send({
                name: RendererClientMessageName.AddRenownAccount,
                payload: steamId,
            });
            dispatch(accountAdded({ account }));
            setIsBusy(false);
            return true;
        }
        catch (error) {
            let errorMessage;
            switch (error) {
                case ErrorCode.RenownApiResourceNotFound:
                    errorMessage = React.createElement(Trans, null, "Player not found.");
                    break;
                case ErrorCode.RenownApiError:
                    errorMessage = React.createElement(Trans, null, "The API returned an error, please re-try later.");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
            }
            setErrorMessage(errorMessage);
            setIsBusy(false);
            return false;
        }
    };
    return { addAccount, isBusy, errorMessage };
}
//# sourceMappingURL=use-add-renown-account.js.map