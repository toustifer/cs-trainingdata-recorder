import { Trans, useLingui } from '@lingui/react/macro';
import React, { useState } from 'react';
import { useDialog } from './use-dialog';
import { XlsxOutputType } from 'csdm/node/xlsx/xlsx-output';
import { RadioInput } from '../inputs/radio-input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { Button, ButtonVariant } from '../buttons/button';
import { CloseButton } from '../buttons/close-button';
import { getFormattedDateForFilename } from 'csdm/common/date/get-formatted-date-for-filename';
export function ExportXlsxOptionsDialog({ ids, onOutputSelected, renderCheckboxes }) {
    const { t } = useLingui();
    const { hideDialog } = useDialog();
    const [atLeastOneSheetSelected, setAtLeastOneSheetSelected] = useState(true);
    const [outputType, setOutputType] = useState(XlsxOutputType.SingleFile);
    const isExportButtonDisabled = !atLeastOneSheetSelected;
    const isSingleSelection = ids.length === 1;
    const isAtLeastOneSheetSelected = (formData) => {
        for (const fieldName of formData.keys()) {
            if (fieldName.startsWith('sheets.')) {
                return true;
            }
        }
        return false;
    };
    const onFormChange = (event) => {
        const formData = new FormData(event.currentTarget);
        setAtLeastOneSheetSelected(isAtLeastOneSheetSelected(formData));
    };
    const onSubmit = async (event) => {
        if (isExportButtonDisabled) {
            return;
        }
        const formData = new FormData(event.currentTarget);
        if (outputType === XlsxOutputType.SingleFile && !isSingleSelection) {
            const name = getFormattedDateForFilename('xlsx');
            const options = {
                buttonLabel: t({
                    context: 'Button label',
                    message: 'Export',
                }),
                defaultPath: name,
                filters: [{ name, extensions: ['xlsx'] }],
            };
            const { canceled, filePath: outputFilePath } = await window.csdm.showSaveDialog(options);
            if (canceled || outputFilePath === undefined) {
                return;
            }
            onOutputSelected('file', outputFilePath, formData);
        }
        else {
            const options = {
                buttonLabel: t({
                    context: 'Button label',
                    message: 'Export',
                }),
                properties: ['openDirectory'],
            };
            const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
            if (canceled || filePaths.length === 0) {
                return;
            }
            onOutputSelected('folder', filePaths[0], formData);
        }
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Excel export"))),
        React.createElement("form", { onSubmit: onSubmit, onChange: onFormChange },
            React.createElement(DialogContent, null,
                React.createElement("div", { className: "gap-y-8" },
                    React.createElement("div", { className: isSingleSelection ? 'hidden' : undefined },
                        React.createElement("p", { className: "text-body-strong" },
                            React.createElement(Trans, { context: "File destination" }, "Output")),
                        React.createElement("div", { className: "mt-4 flex flex-wrap gap-8" },
                            React.createElement(RadioInput, { id: "single", name: "output-type", value: XlsxOutputType.SingleFile, label: React.createElement(Trans, { context: "Radio label" }, "Single file"), defaultChecked: true, onChange: () => setOutputType(XlsxOutputType.SingleFile) }),
                            React.createElement(RadioInput, { id: "multiple", name: "output-type", value: XlsxOutputType.MultipleFiles, label: React.createElement(Trans, { context: "Radio label" }, "Multiple files"), onChange: () => setOutputType(XlsxOutputType.MultipleFiles) }))),
                    React.createElement("div", { className: "mt-8 max-w-[448px]" },
                        React.createElement("p", { className: "text-body-strong" },
                            React.createElement(Trans, { context: "Excel sheets" }, "Sheets")),
                        React.createElement("div", { className: "mt-4 flex flex-wrap gap-8" }, renderCheckboxes(isSingleSelection || outputType === XlsxOutputType.MultipleFiles))))),
            React.createElement(DialogFooter, null,
                React.createElement(Button, { variant: ButtonVariant.Primary, type: "submit", isDisabled: isExportButtonDisabled },
                    React.createElement(Trans, { context: "Button" }, "Export")),
                React.createElement(CloseButton, { onClick: hideDialog })))));
}
//# sourceMappingURL=export-xlsx-options-dialog.js.map