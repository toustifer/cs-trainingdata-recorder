import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useIgnoredSteamAccounts } from 'csdm/ui/ban/use-ignored-steam-accounts';
import { useIgnoreSteamAccount, useRemoveIgnoredSteamAccount } from 'csdm/ui/settings/bans/use-ignored-steam-account';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function IgnoreSteamAccountBanItem({ steamId }) {
    const ignoredAccounts = useIgnoredSteamAccounts();
    const account = ignoredAccounts.find((account) => account.steamId === steamId);
    const { ignoreSteamAccount, getErrorMessageFromError } = useIgnoreSteamAccount();
    const { removeIgnoredSteamAccount } = useRemoveIgnoredSteamAccount();
    const showToast = useShowToast();
    if (account) {
        return (React.createElement(ContextMenuItem, { onClick: () => {
                removeIgnoredSteamAccount(account);
            } },
            React.createElement(Trans, { context: "Context menu" }, "Stop ignoring player's bans")));
    }
    return (React.createElement(ContextMenuItem, { onClick: async () => {
            try {
                await ignoreSteamAccount(steamId);
                showToast({
                    content: React.createElement(Trans, null, "Steam account added to ignored list"),
                });
            }
            catch (error) {
                const errorMessage = getErrorMessageFromError(error);
                showToast({
                    content: errorMessage,
                });
            }
        } },
        React.createElement(Trans, { context: "Context menu" }, "Ignore player's bans")));
}
//# sourceMappingURL=ignore-steam-account-ban-item.js.map