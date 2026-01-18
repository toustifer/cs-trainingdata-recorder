import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { accountAdded } from '../../downloads/faceit/faceit-actions';
export function useAddFaceitAccount() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [isBusy, setIsBusy] = useState(false);
    const addFaceitAccount = async (nickname) => {
        try {
            if (nickname === '') {
                return false;
            }
            setIsBusy(true);
            const account = await client.send({
                name: RendererClientMessageName.AddFaceitAccount,
                payload: nickname,
            });
            dispatch(accountAdded({ account }));
            setIsBusy(false);
            return true;
        }
        catch (error) {
            let errorMessage;
            switch (error) {
                case ErrorCode.FaceItApiResourceNotFound:
                    errorMessage = React.createElement(Trans, null, "Player not found.");
                    break;
                case ErrorCode.FaceItApiError:
                    errorMessage = React.createElement(Trans, null, "The API returned an error, please re-try later.");
                    break;
                case ErrorCode.FaceItApiForbidden:
                    errorMessage = React.createElement(Trans, null, "The API returned a forbidden error, please check your API key.");
                    break;
                case ErrorCode.FaceItApiInvalidRequest:
                    errorMessage = React.createElement(Trans, null, "Invalid API request.");
                    break;
                case ErrorCode.FaceItApiUnauthorized:
                    errorMessage = React.createElement(Trans, null, "The API returned a 401 code, please check you API key.");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
            }
            setErrorMessage(errorMessage);
            setIsBusy(false);
            return false;
        }
    };
    return { addFaceitAccount, isBusy, errorMessage };
}
//# sourceMappingURL=use-add-faceit-account.js.map