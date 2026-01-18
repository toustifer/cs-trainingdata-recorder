import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { SpinnableButton } from 'csdm/ui/components/buttons/spinnable-button';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { Status } from 'csdm/common/types/status';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { useIgnoreSteamAccount } from './use-ignored-steam-account';
export function AddIgnoredSteamAccountDialog() {
    const [status, setStatus] = useState(Status.Idle);
    const [errorMessage, setErrorMessage] = useState('');
    const [steamIdentifier, setSteamIdentifier] = useState('');
    const { hideDialog } = useDialog();
    const { ignoreSteamAccount, getErrorMessageFromError } = useIgnoreSteamAccount();
    const submit = async () => {
        try {
            setStatus(Status.Loading);
            await ignoreSteamAccount(steamIdentifier);
            hideDialog();
        }
        catch (error) {
            setStatus(Status.Error);
            const errorMessage = getErrorMessageFromError(error);
            setErrorMessage(errorMessage);
        }
    };
    return (React.createElement(Dialog, { closeOnBackgroundClicked: status !== Status.Loading, closeOnEscPressed: status !== Status.Loading, onEnterPressed: submit },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Ignore Steam account"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex flex-col gap-y-12" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "The Steam account will be ignored from VAC ban stats.")),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(TextInput, { autoFocus: true, label: React.createElement(Trans, { context: "Input label" }, "SteamID64 or Steam community profile URL"), placeholder: "https://steamcommunity.com/id/username/ | 76561198000697560", value: steamIdentifier, onChange: (event) => {
                            setSteamIdentifier(event.target.value);
                        } }),
                    status === Status.Error && React.createElement(ErrorMessage, { message: errorMessage })))),
        React.createElement(DialogFooter, null,
            React.createElement(SpinnableButton, { onClick: submit, isLoading: status === Status.Loading, isDisabled: steamIdentifier === '' },
                React.createElement(Trans, { context: "Button" }, "Add")),
            React.createElement(CloseButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=add-ignored-steam-account-dialog.js.map