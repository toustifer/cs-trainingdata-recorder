import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { Button } from 'csdm/ui/components/buttons/button';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { Status } from 'csdm/common/types/status';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { SpinnableButton } from 'csdm/ui/components/buttons/spinnable-button';
import { ErrorMessage } from 'csdm/ui/components/error-message';
function Header() {
    return (React.createElement(DialogHeader, null,
        React.createElement(DialogTitle, null,
            React.createElement(Trans, { context: "Dialog title" }, "JSON export"))));
}
export function ExportMatchesToJsonDialog({ checksums }) {
    const [status, setStatus] = useState(Status.Idle);
    const [outputFolderPath, setOutputFolderPath] = useState('');
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const { hideDialog } = useDialog();
    const { t } = useLingui();
    const isLoading = status === Status.Loading;
    const isOutputPathSelected = outputFolderPath !== '';
    const isExportPossible = isLoading || !isOutputPathSelected;
    const selectOutputFolder = async () => {
        const { filePaths, canceled } = await window.csdm.showOpenDialog({
            buttonLabel: t({
                context: 'Button label',
                message: 'Select',
            }),
            properties: ['openDirectory'],
        });
        if (canceled || filePaths.length === 0) {
            return;
        }
        const outputFolderPath = filePaths[0];
        setOutputFolderPath(outputFolderPath);
    };
    const onSubmit = async (event) => {
        if (isExportPossible) {
            return;
        }
        try {
            const formData = new FormData(event.currentTarget);
            setStatus(Status.Loading);
            await client.send({
                name: RendererClientMessageName.ExportMatchesToJson,
                payload: {
                    checksums,
                    outputFolderPath,
                    minify: formData.has('minify'),
                },
            });
            hideDialog();
            showToast({
                content: (React.createElement("div", null,
                    React.createElement("p", null,
                        React.createElement(Trans, { context: "Notification" }, "Export done")),
                    React.createElement("p", null,
                        React.createElement(Trans, { context: "Notification" }, "Click here to reveal the output folder")))),
                type: 'success',
                onClick: () => {
                    window.csdm.browseToFolder(outputFolderPath);
                },
            });
        }
        catch (error) {
            setStatus(Status.Error);
        }
    };
    return (React.createElement(Dialog, null,
        React.createElement(Header, null),
        React.createElement("form", { onSubmit: onSubmit },
            React.createElement(DialogContent, null,
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "mb-8 text-body-strong" },
                            React.createElement(Trans, { context: "File destination" }, "Output")),
                        React.createElement("div", { className: "flex flex-col items-start gap-y-12" },
                            isOutputPathSelected && (React.createElement("div", { className: "flex w-full max-w-[400px]" },
                                React.createElement(TextInput, { value: outputFolderPath, isReadOnly: true, isDisabled: isLoading }))),
                            React.createElement("div", { className: "flex items-center gap-x-8" },
                                React.createElement(Button, { onClick: selectOutputFolder, isDisabled: isLoading },
                                    React.createElement(Trans, { context: "Button to select an export output folder" }, "Select folder")),
                                React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Minify"), name: "minify", defaultChecked: false, isDisabled: isLoading })))),
                    status === Status.Error && React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "An error occurred.") }))),
            React.createElement(DialogFooter, null,
                React.createElement(SpinnableButton, { type: "submit", isDisabled: isExportPossible, isLoading: isLoading },
                    React.createElement(Trans, { context: "Button" }, "Export")),
                React.createElement(CloseButton, { onClick: hideDialog, isDisabled: isLoading })))));
}
//# sourceMappingURL=export-matches-to-json-dialog.js.map