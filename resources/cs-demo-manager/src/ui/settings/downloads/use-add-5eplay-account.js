import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { accountAdded } from 'csdm/ui/downloads/five-eplay/5eplay-actions';
export function useAdd5EPlayAcount() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [isBusy, setIsBusy] = useState(false);
    const add5EPlayAccount = async (domainId) => {
        try {
            if (domainId === '') {
                return false;
            }
            setIsBusy(true);
            const account = await client.send({
                name: RendererClientMessageName.Add5EPlayAccount,
                payload: domainId,
            });
            dispatch(accountAdded({ account }));
            setIsBusy(false);
            return true;
        }
        catch (error) {
            let errorMessage;
            switch (error) {
                case ErrorCode.FiveEPlayApiResourceNotFound:
                    errorMessage = React.createElement(Trans, null, "Player not found.");
                    break;
                case ErrorCode.FiveEPlayApiInvalidRequest:
                    errorMessage = React.createElement(Trans, null, "Invalid API request.");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
            }
            setErrorMessage(errorMessage);
            setIsBusy(false);
            return false;
        }
    };
    return { add5EPlayAccount, isBusy, errorMessage };
}
//# sourceMappingURL=use-add-5eplay-account.js.map