import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { DeleteButton } from 'csdm/ui/components/buttons/delete-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useIgnoredSteamAccounts } from 'csdm/ui/ban/use-ignored-steam-accounts';
import { AddIgnoredSteamAccountDialog } from './add-ignored-steam-account-dialog';
import { buildPlayerSteamProfileUrl } from 'csdm/ui/shared/build-player-steam-profile-url';
import { useRemoveIgnoredSteamAccount } from './use-ignored-steam-account';
export function IgnoredSteamAccounts() {
    const accounts = useIgnoredSteamAccounts();
    const { showDialog } = useDialog();
    const { removeIgnoredSteamAccount } = useRemoveIgnoredSteamAccount();
    const onClick = () => {
        showDialog(React.createElement(AddIgnoredSteamAccountDialog, null));
    };
    return (React.createElement("div", null,
        React.createElement("h2", { className: "text-subtitle" },
            React.createElement(Trans, { context: "Settings title" }, "Ignored Steam accounts")),
        React.createElement("div", { className: "my-8" },
            React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
                React.createElement(Trans, null, "Add Steam account"))),
        React.createElement("p", null,
            React.createElement(Trans, null, "The following Steam accounts will be ignored from VAC ban stats.")),
        accounts.length > 0 ? (accounts.map((account) => {
            const onDeleteClick = async () => {
                await removeIgnoredSteamAccount(account);
            };
            return (React.createElement("div", { className: "flex w-fit border-t border-gray-300 py-4 last:border-b", key: account.steamId },
                React.createElement("a", { className: "mr-8 flex w-[384px] items-center gap-x-8", href: buildPlayerSteamProfileUrl(account.steamId), target: "_blank", rel: "noreferrer" },
                    React.createElement("img", { className: "w-32", src: account.avatar }),
                    React.createElement("p", { className: "truncate", title: account.name }, account.name)),
                React.createElement(DeleteButton, { onClick: onDeleteClick })));
        })) : (React.createElement("p", null,
            React.createElement(Trans, null, "No ignored Steam account yet.")))));
}
//# sourceMappingURL=ignored-steam-accounts.js.map