import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { DeleteButton } from 'csdm/ui/components/buttons/delete-button';
import { AccountAvatar } from './account-avatar';
export function ThirdPartyAccounts({ accounts, getAccountUrl, onSetAsCurrentClick, onDeleteClick, onAddClick, }) {
    function renderAccounts() {
        if (accounts.length === 0) {
            return (React.createElement("p", null,
                React.createElement(Trans, null, "No accounts")));
        }
        return accounts.map((account) => {
            const avatarSrc = account.avatarUrl === '' ? window.csdm.getDefaultPlayerAvatar() : account.avatarUrl;
            return (React.createElement("div", { className: "flex w-full rounded-8 border border-gray-300 p-8", key: account.id },
                React.createElement("a", { className: "mr-8 flex w-full items-center gap-x-4", href: getAccountUrl(account), target: "_blank", rel: "noreferrer" },
                    React.createElement(AccountAvatar, { url: avatarSrc, playerName: account.nickname }),
                    React.createElement("p", { className: "truncate", title: account.nickname }, account.nickname)),
                React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(Button, { onClick: async () => {
                            await onSetAsCurrentClick(account.id);
                        }, isDisabled: account.isCurrent },
                        React.createElement(Trans, null, "Set as current account")),
                    React.createElement(DeleteButton, { onClick: async () => {
                            await onDeleteClick(account.id);
                        } }))));
        });
    }
    return (React.createElement("div", null,
        React.createElement("h3", { className: "py-8 text-body-strong" },
            React.createElement(Trans, null, "Accounts")),
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            renderAccounts(),
            React.createElement("div", null,
                React.createElement(Button, { variant: ButtonVariant.Primary, onClick: onAddClick },
                    React.createElement(Trans, { context: "Button" }, "Add account"))))));
}
//# sourceMappingURL=third-party-accounts.js.map