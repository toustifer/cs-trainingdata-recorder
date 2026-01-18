import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { useAddFaceitAccount } from '../../settings/downloads/use-add-faceit-account';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
export function NoFaceitAccount() {
    const { t } = useLingui();
    const [nickname, setNickname] = useState('');
    const { addFaceitAccount, errorMessage, isBusy } = useAddFaceitAccount();
    const submit = () => {
        addFaceitAccount(nickname);
    };
    const isDisabled = isBusy || nickname === '';
    return (React.createElement("div", { className: "mx-auto mt-48 flex max-w-[600px] flex-col" },
        React.createElement("p", { className: "text-body-strong" },
            React.createElement(Trans, null, "To add a FACEIT account, enter your FACEIT nickname.")),
        React.createElement("div", { className: "mt-8 w-[228px]" },
            React.createElement(TextInput, { placeholder: t({ message: 'FACEIT nickname', context: 'Input placeholder' }), onChange: (event) => {
                    setNickname(event.target.value);
                }, autoFocus: true, value: nickname, isDisabled: isBusy, onEnterKeyDown: submit })),
        React.createElement("div", { className: "mt-4 flex items-center gap-x-8" },
            React.createElement(ExclamationTriangleIcon, { className: "size-12 text-orange-700" }),
            React.createElement("p", { className: "text-caption" },
                React.createElement(Trans, null, "The nickname is case sensitive!"))),
        React.createElement("div", { className: "my-8" },
            React.createElement(Button, { variant: ButtonVariant.Primary, onClick: submit, isDisabled: isDisabled },
                React.createElement(Trans, { context: "Button" }, "Add"))),
        errorMessage && React.createElement(ErrorMessage, { message: errorMessage })));
}
//# sourceMappingURL=no-faceit-account.js.map