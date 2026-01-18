import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { Status } from 'csdm/common/types/status';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { demoRenamed } from 'csdm/ui/demos/demos-actions';
import { ErrorCode } from 'csdm/common/error-code';
import { isEmptyString } from 'csdm/common/string/is-empty-string';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ErrorMessage } from '../error-message';
export function RenameDialog({ checksum, currentName }) {
    const [status, setStatus] = useState(Status.Idle);
    const [name, setName] = useState(currentName);
    const unknownError = React.createElement(Trans, null, "An error occurred.");
    const [error, setError] = useState(unknownError);
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const submit = async () => {
        if (name === currentName) {
            hideDialog();
            return;
        }
        try {
            setStatus(Status.Loading);
            await client.send({
                name: RendererClientMessageName.RenameDemo,
                payload: {
                    checksum,
                    name,
                },
            });
            dispatch(demoRenamed({ checksum, name }));
            hideDialog();
        }
        catch (error) {
            if (error === ErrorCode.InvalidDemoName) {
                setError(React.createElement(Trans, null, "Invalid name."));
            }
            else {
                setError(unknownError);
            }
            setStatus(Status.Error);
        }
    };
    const onChange = (event) => {
        setName(event.target.value);
    };
    const isBusy = status === Status.Loading;
    const isValidName = isEmptyString(name);
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Rename"), onConfirm: submit, isBusy: isBusy, isConfirmButtonDisabled: isValidName, closeOnConfirm: false },
        React.createElement("div", { className: "flex max-w-[448px] flex-col gap-y-8" },
            React.createElement("p", null,
                React.createElement(Trans, null, "Only the name visible from the application will change, it will not change the filename on your operating system.")),
            React.createElement(TextInput, { value: name, autoFocus: true, isDisabled: isBusy, onChange: onChange, placeholder: currentName, onEnterKeyDown: submit }),
            status === Status.Error && React.createElement(ErrorMessage, { message: error }))));
}
//# sourceMappingURL=rename-dialog.js.map