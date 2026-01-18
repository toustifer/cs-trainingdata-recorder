import React, { useRef, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { isErrorCode } from 'csdm/common/is-error-code';
import { ErrorCode } from 'csdm/common/error-code';
import { Status } from 'csdm/common/types/status';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { steamAccountNameUpdated } from 'csdm/ui/player/player-actions';
import { UpdateButton } from 'csdm/ui/components/buttons/update-button';
export function UpdatePlayerNameDialog({ steamId, name }) {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const formRef = useRef(null);
    const [status, setStatus] = useState(Status.Idle);
    const [error, setError] = useState('');
    const isUpdating = status === Status.Loading;
    const onSubmit = async () => {
        const form = formRef.current;
        if (isUpdating || !form) {
            return;
        }
        try {
            const formData = new FormData(form);
            const wantedName = formData.get('name');
            if (wantedName === name) {
                hideDialog();
                return;
            }
            setStatus(Status.Loading);
            const newName = await client.send({
                name: RendererClientMessageName.UpdateSteamAccountName,
                payload: {
                    steamId,
                    name: wantedName,
                },
            });
            dispatch(steamAccountNameUpdated({
                steamId,
                name: newName,
            }));
            hideDialog();
        }
        catch (error) {
            const errorCode = isErrorCode(error) ? error : ErrorCode.UnknownError;
            let errorMessage;
            switch (errorCode) {
                case ErrorCode.SteamAccountNameTooLong:
                    errorMessage = React.createElement(Trans, null, "The name is too long");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
                    break;
            }
            setError(errorMessage);
            setStatus(Status.Error);
        }
    };
    return (React.createElement(Dialog, { onEnterPressed: onSubmit, blockNavigation: isUpdating, closeOnBackgroundClicked: !isUpdating, closeOnEscPressed: !isUpdating },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Update player name"))),
        React.createElement(DialogContent, null,
            React.createElement("form", { id: "player-form", ref: formRef, onSubmit: onSubmit, className: "flex max-w-[524px] flex-col gap-y-8" },
                React.createElement(TextInput, { name: "name", defaultValue: name, isDisabled: isUpdating, label: React.createElement(Trans, { context: "Input label" }, "Name") }),
                React.createElement("div", { className: "mt-8 flex items-center gap-x-8" },
                    React.createElement(ExclamationTriangleIcon, { className: "size-24 text-orange-700" }),
                    React.createElement("p", null,
                        React.createElement(Trans, null, "It will override the name of the player identified by his Steam ID every place in the application."))),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Leave it empty to remove the override.")),
                status === Status.Error && React.createElement(ErrorMessage, { message: error }))),
        React.createElement(DialogFooter, null,
            React.createElement(UpdateButton, { type: "submit", form: "player-name", onClick: onSubmit }),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=update-player-name-dialog.js.map