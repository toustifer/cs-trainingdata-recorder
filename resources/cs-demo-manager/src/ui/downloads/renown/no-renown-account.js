import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { useAddRenownAccount } from 'csdm/ui/settings/downloads/use-add-renown-account';
export function NoRenownAccount() {
    const { t } = useLingui();
    const [steamId, setSteamId] = useState('');
    const { addAccount, errorMessage, isBusy } = useAddRenownAccount();
    const submit = () => {
        addAccount(steamId);
    };
    const isDisabled = isBusy || steamId === '';
    return (React.createElement("div", { className: "mx-auto mt-48 flex max-w-[600px] flex-col" },
        React.createElement("p", { className: "text-body-strong" },
            React.createElement(Trans, null, "No Renown account configured yet. Enter your Steam ID to get started.")),
        React.createElement("div", { className: "mt-8 flex flex-col gap-y-4" },
            React.createElement(TextInput, { placeholder: t({ message: 'Steam ID', context: 'Input placeholder' }), onChange: (event) => {
                    setSteamId(event.target.value);
                }, autoFocus: true, value: steamId, isDisabled: isBusy, onEnterKeyDown: submit }),
            React.createElement("p", { className: "text-caption" },
                React.createElement(Trans, null, "Use the 64-bit version of your Steam ID (e.g., 76561198000000000)."))),
        React.createElement("div", { className: "my-8" },
            React.createElement(Button, { variant: ButtonVariant.Primary, onClick: submit, isDisabled: isDisabled },
                React.createElement(Trans, { context: "Button" }, "Add"))),
        errorMessage && React.createElement(ErrorMessage, { message: errorMessage })));
}
//# sourceMappingURL=no-renown-account.js.map