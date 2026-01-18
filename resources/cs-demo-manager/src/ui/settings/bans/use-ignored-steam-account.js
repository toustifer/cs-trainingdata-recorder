import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { addIgnoredSteamAccountSuccess, deleteIgnoredSteamAccountSuccess } from 'csdm/ui/ban/ban-actions';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function useIgnoreSteamAccount() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const getErrorMessageFromError = (error) => {
        switch (error) {
            case ErrorCode.SteamAccountAlreadyIgnored:
                return React.createElement(Trans, null, "This account is already ignored.");
            case ErrorCode.SteamAccountNotFound:
                return React.createElement(Trans, null, "Steam account not found.");
            case ErrorCode.InvalidSteamCommunityUrl:
                return React.createElement(Trans, null, "Invalid Steam community URL.");
            case ErrorCode.SteamApiForbidden:
                return React.createElement(Trans, null, "The Steam API returned a forbidden error.");
            case ErrorCode.SteamApiTooManyRequests:
                return React.createElement(Trans, null, "Too many requests sent to the Steam API.");
            case ErrorCode.SteamApiError:
                return React.createElement(Trans, null, "The Steam API returned an error.");
            default:
                return React.createElement(Trans, null, "An error occurred.");
        }
    };
    const ignoreSteamAccount = async (steamIdentifier) => {
        const account = await client.send({
            name: RendererClientMessageName.AddIgnoredSteamAccount,
            payload: steamIdentifier,
        });
        dispatch(addIgnoredSteamAccountSuccess({
            account,
        }));
        return account;
    };
    return {
        ignoreSteamAccount,
        getErrorMessageFromError,
    };
}
export function useRemoveIgnoredSteamAccount() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const removeIgnoredSteamAccount = async (account) => {
        try {
            await client.send({
                name: RendererClientMessageName.DeleteIgnoredSteamAccount,
                payload: account.steamId,
            });
            dispatch(deleteIgnoredSteamAccountSuccess({ account }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                type: 'error',
            });
        }
    };
    return {
        removeIgnoredSteamAccount,
    };
}
//# sourceMappingURL=use-ignored-steam-account.js.map