import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { useAdd5EPlayAcount } from 'csdm/ui/settings/downloads/use-add-5eplay-account';
import { FiveEPlayAccountInstructions } from './five-eplay-account-instructions';
export function No5EPlayAccount() {
    const { t } = useLingui();
    const [domainId, setDomainId] = useState('');
    const { add5EPlayAccount, errorMessage, isBusy } = useAdd5EPlayAcount();
    const submit = () => {
        add5EPlayAccount(domainId);
    };
    const isDisabled = isBusy || domainId === '';
    return (React.createElement("div", { className: "mx-auto mt-48 flex flex-col" },
        React.createElement("p", { className: "text-body-strong" },
            React.createElement(Trans, null, "To add a 5EPlay account, enter your 5EPlay ID.")),
        React.createElement("div", { className: "mt-8 w-[228px]" },
            React.createElement(TextInput, { placeholder: t({ message: '5EPlay ID', context: 'Input placeholder' }), onChange: (event) => {
                    setDomainId(event.target.value);
                }, autoFocus: true, value: domainId, isDisabled: isBusy, onEnterKeyDown: submit })),
        React.createElement("div", { className: "my-8" },
            React.createElement(Button, { variant: ButtonVariant.Primary, onClick: submit, isDisabled: isDisabled },
                React.createElement(Trans, { context: "Button" }, "Add"))),
        errorMessage && React.createElement(ErrorMessage, { message: errorMessage }),
        React.createElement(FiveEPlayAccountInstructions, null)));
}
//# sourceMappingURL=no-5eplay-account.js.map