import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { Status } from 'csdm/common/types/status';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { SpinnableButton } from 'csdm/ui/components/buttons/spinnable-button';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { CounterStrikeRunningDialog } from 'csdm/ui/components/dialogs/counter-strike-running-dialog';
import { ErrorCode } from 'csdm/common/error-code';
import { useGetBoilerErrorMessageFromErrorCode } from 'csdm/ui/downloads/use-get-boiler-error-message-from-error-code';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useIsCsRunning } from 'csdm/ui/hooks/use-is-cs-running';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ErrorMessage } from 'csdm/ui/components/error-message';
function DownloadDemoFromShareCodeDialog() {
    const [state, setState] = useState({
        shareCode: '',
        status: Status.Idle,
        csIsRunning: false,
        error: undefined,
    });
    const client = useWebSocketClient();
    const isCsRunning = useIsCsRunning();
    const { hideDialog } = useDialog();
    const { t } = useLingui();
    const getBoilerErrorMessageFromErrorCode = useGetBoilerErrorMessageFromErrorCode();
    const { shareCode, status, error, csIsRunning } = state;
    const isShareCodeEmpty = shareCode.length === 0;
    const sendDownloadDemoFromShareCode = async () => {
        setState({
            ...state,
            status: Status.Loading,
            csIsRunning: false,
        });
        try {
            await client.send({
                name: RendererClientMessageName.AddDownloadFromShareCode,
                payload: shareCode,
            });
            hideDialog();
        }
        catch (error) {
            let errorMessage;
            switch (error) {
                case ErrorCode.InvalidShareCode:
                    errorMessage = React.createElement(Trans, null, "Invalid share code.");
                    break;
                case ErrorCode.DecodeShareCodeError:
                    errorMessage = React.createElement(Trans, null, "An error occurred while decoding the share code.");
                    break;
                case ErrorCode.DownloadFolderNotDefined:
                    errorMessage = React.createElement(Trans, null, "A download folder is required. You can change it from settings.");
                    break;
                case ErrorCode.DownloadFolderNotExists:
                    errorMessage = React.createElement(Trans, null, "The download folder doesn't exist, please change it from the settings.");
                    break;
                case ErrorCode.MatchAlreadyInDownloadQueue:
                    errorMessage = React.createElement(Trans, null, "This match is already in pending downloads.");
                    break;
                case ErrorCode.MatchAlreadyDownloaded:
                    errorMessage = React.createElement(Trans, null, "This match is already in your downloads folder.");
                    break;
                case ErrorCode.DemoLinkExpired:
                    errorMessage = React.createElement(Trans, null, "The download link has expired.");
                    break;
                default:
                    errorMessage = getBoilerErrorMessageFromErrorCode(t `An error occurred.`, error);
            }
            setState({
                ...state,
                status: Status.Error,
                error: errorMessage,
            });
        }
    };
    const onSubmit = async () => {
        if (isShareCodeEmpty) {
            return;
        }
        setState({
            ...state,
            status: Status.Loading,
        });
        const csIsRunning = await isCsRunning();
        if (csIsRunning) {
            setState({
                ...state,
                status: Status.Idle,
                csIsRunning: true,
            });
        }
        else {
            setState({
                ...state,
                status: Status.Loading,
                error: undefined,
            });
            sendDownloadDemoFromShareCode();
        }
    };
    const onShareCodeChange = (event) => {
        setState({
            ...state,
            shareCode: event.target.value,
        });
    };
    if (csIsRunning) {
        return React.createElement(CounterStrikeRunningDialog, { onConfirmClick: sendDownloadDemoFromShareCode });
    }
    return (React.createElement(Dialog, { closeOnBackgroundClicked: status !== Status.Loading, closeOnEscPressed: status !== Status.Loading, onEnterPressed: onSubmit },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Share code"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement(TextInput, { autoFocus: true, placeholder: "CSGO-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX", value: shareCode, onChange: onShareCodeChange, isDisabled: status === Status.Loading, label: React.createElement(Trans, null, "Enter a share code") }),
                status === Status.Error && React.createElement(ErrorMessage, { message: error }))),
        React.createElement(DialogFooter, null,
            React.createElement(SpinnableButton, { onClick: onSubmit, isDisabled: isShareCodeEmpty, isLoading: status === Status.Loading },
                React.createElement(Trans, { context: "Button" }, "Download")),
            React.createElement(CancelButton, { onClick: hideDialog, isDisabled: status === Status.Loading }))));
}
export function DownloadDemoFromShareCodeButton() {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(DownloadDemoFromShareCodeDialog, null));
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Share code")));
}
//# sourceMappingURL=download-demo-from-share-code-button.js.map