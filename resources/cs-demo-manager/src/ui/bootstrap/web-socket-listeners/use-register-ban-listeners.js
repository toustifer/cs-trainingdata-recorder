import React, { useEffect } from 'react';
import { Trans } from '@lingui/react/macro';
import { ErrorCode } from 'csdm/common/error-code';
import { SharedServerMessageName } from 'csdm/server/shared-server-message-name';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function useRegisterBanListeners(client) {
    const showToast = useShowToast();
    useEffect(() => {
        const onCheckForNewBannedAccountsError = (errorCode) => {
            let message;
            switch (errorCode) {
                case ErrorCode.SteamApiForbidden:
                    message = React.createElement(Trans, null, "The Steam API returned a forbidden error");
                    break;
                case ErrorCode.SteamApiTooManyRequests:
                    message = React.createElement(Trans, null, "Steam API returned a 429 status code");
                    break;
                default:
                    message = React.createElement(Trans, null,
                        "An error occurred while checking for new banned Steam accounts (code ",
                        errorCode,
                        ")");
            }
            showToast({
                content: message,
                id: 'check-new-banned-accounts-error',
                type: 'error',
            });
        };
        client.on(SharedServerMessageName.NewBannedAccountsError, onCheckForNewBannedAccountsError);
        return () => {
            client.off(SharedServerMessageName.NewBannedAccountsError, onCheckForNewBannedAccountsError);
        };
    });
}
//# sourceMappingURL=use-register-ban-listeners.js.map