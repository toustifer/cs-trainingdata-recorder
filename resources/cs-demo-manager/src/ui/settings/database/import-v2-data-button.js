import React, { useState } from 'react';
import { Plural, Trans, useLingui } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { useFolders } from '../folders/use-folders';
import { ErrorCode } from 'csdm/common/error-code';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { SpinnableButton } from 'csdm/ui/components/buttons/spinnable-button';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
function PathList({ paths }) {
    return (React.createElement("ul", { className: "max-h-[200px] overflow-auto rounded-4 border border-gray-300" }, paths.map((path) => {
        return (React.createElement("li", { key: path, className: "selectable px-8 py-4 font-bold whitespace-nowrap" }, path));
    })));
}
function ImportV2DataDialog() {
    const client = useWebSocketClient();
    const { t } = useLingui();
    const [error, setError] = useState(null);
    const [backupFilePath, setBackupFilePath] = useState('');
    const [isBusy, setIsBusy] = useState(false);
    const [importComments, setImportComments] = useState(true);
    const [importStatuses, setImportStatuses] = useState(true);
    const [result, setResult] = useState(null);
    const { hideDialog } = useDialog();
    const folders = useFolders();
    const onSelectBackupFileClick = async () => {
        const options = {
            properties: ['openFile'],
            filters: [{ extensions: ['json'], name: t `JSON file` }],
        };
        const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
        if (canceled || filePaths.length === 0) {
            return;
        }
        setBackupFilePath(filePaths[0]);
    };
    const onImportClick = async () => {
        if (isBusy) {
            return;
        }
        if (!importComments && !importStatuses) {
            return setError(React.createElement(Trans, null, "You must select at least one data to import."));
        }
        if (backupFilePath === '') {
            return setError(React.createElement(Trans, null, "You must select a CS:DM V2 backup file."));
        }
        if (folders.length === 0) {
            return setError(React.createElement(Trans, null, "You need at least one folder."));
        }
        try {
            setError(null);
            setIsBusy(true);
            const result = await client.send({
                name: RendererClientMessageName.ImportDataFromV2Backup,
                payload: {
                    backupFilePath,
                    importComments,
                    importStatuses,
                },
            });
            setResult(result);
        }
        catch (error) {
            let errorMessage;
            switch (error) {
                case ErrorCode.InvalidBackupFile:
                    errorMessage = React.createElement(Trans, null, "The backup file is invalid.");
                    break;
                case ErrorCode.TagNotFound:
                    errorMessage = React.createElement(Trans, null, "A required tag has not been found.");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
            }
            setError(errorMessage);
        }
        setIsBusy(false);
    };
    const renderForm = () => {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex flex-col gap-y-4" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "Select the JSON backup file generated from the CS:DM V2.")),
                React.createElement("div", null,
                    React.createElement(Button, { onClick: onSelectBackupFileClick, variant: ButtonVariant.Primary },
                        React.createElement(Trans, { context: "Button" }, "Select backup file"))),
                backupFilePath !== '' && (React.createElement("div", { className: "rounded-4 border border-gray-300" },
                    React.createElement("p", { className: "selectable px-8 py-4 font-bold" }, backupFilePath)))),
            React.createElement("div", null,
                React.createElement(Checkbox, { label: React.createElement(Trans, null, "Import comments"), isChecked: importComments, onChange: (event) => {
                        setImportComments(event.target.checked);
                    } }),
                React.createElement(Checkbox, { label: React.createElement(Trans, null, "Import statuses"), isChecked: importStatuses, onChange: (event) => {
                        setImportStatuses(event.target.checked);
                    } })),
            React.createElement("div", { className: "flex flex-col gap-4" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "The comment and status of the demos inside the following folders will be updated:")),
                folders.length > 0 ? (React.createElement(PathList, { paths: folders.map((folder) => folder.path) })) : (React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "No folders found.") }))),
            error && (React.createElement("div", { className: "mt-8" },
                React.createElement(ErrorMessage, { message: error })))));
    };
    const renderResult = ({ demoFoundCount, demoToImportCount, updatedDemoPaths }) => {
        const updatedDemoCount = updatedDemoPaths.length;
        return (React.createElement(React.Fragment, null,
            React.createElement("p", null,
                React.createElement(Plural, { value: demoToImportCount, one: React.createElement(Trans, null,
                        React.createElement("strong", null, "#"),
                        " demo to import found in the backup file."), other: React.createElement(Trans, null,
                        React.createElement("strong", null, "#"),
                        " demos to import found in the backup file.") })),
            React.createElement("p", null,
                React.createElement(Plural, { value: demoToImportCount, one: React.createElement(Trans, null,
                        React.createElement("strong", null, demoFoundCount),
                        " demo found in folders."), other: React.createElement(Trans, null,
                        React.createElement("strong", null, demoFoundCount),
                        " demos found in folders.") })),
            updatedDemoCount > 0 && (React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Plural, { value: demoToImportCount, one: React.createElement(Trans, null,
                            React.createElement("strong", null, updatedDemoCount),
                            " demo updated:"), other: React.createElement(Trans, null,
                            React.createElement("strong", null, updatedDemoCount),
                            " demos updated:") })),
                React.createElement(PathList, { paths: updatedDemoPaths })))));
    };
    return (React.createElement(Dialog, { closeOnBackgroundClicked: !isBusy, closeOnEscPressed: !isBusy },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Import CS:DM V2"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex w-[620px] flex-col gap-y-8" }, result ? renderResult(result) : renderForm())),
        React.createElement(DialogFooter, null,
            result === null && (React.createElement(SpinnableButton, { onClick: onImportClick, variant: ButtonVariant.Primary, isLoading: isBusy },
                React.createElement(Trans, { context: "Button" }, "Import"))),
            React.createElement(CloseButton, { onClick: hideDialog, isDisabled: isBusy }))));
}
export function ImportV2DataButton() {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(ImportV2DataDialog, null));
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Import V2 data")));
}
//# sourceMappingURL=import-v2-data-button.js.map