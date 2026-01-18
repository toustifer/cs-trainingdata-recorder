import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { Button } from 'csdm/ui/components/buttons/button';
import { RevealFolderInExplorerButton } from '../buttons/reveal-folder-in-explorer-button';
import { RevealFileInExplorerButton } from '../buttons/reveal-file-in-explorer-button';
export function FileOrDirectoryInput({ label, placeholder, path, type, onFileSelected, defaultPath, filters, dialogTitle, name, isInputDisabled = false, isSelectButtonDisabled = false, isRevealButtonDisabled = false, ...props }) {
    const isFile = type === 'file';
    const onChangeClick = async () => {
        const options = {
            title: dialogTitle,
            defaultPath,
            filters,
            properties: isFile ? ['openFile'] : ['openDirectory'],
        };
        const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
        if (canceled || filePaths.length === 0) {
            return;
        }
        const [filePath] = filePaths;
        onFileSelected(filePath);
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-4" },
        React.createElement(TextInput, { label: label, name: name, isReadOnly: true, placeholder: placeholder, isDisabled: isInputDisabled, value: path, ...props }),
        React.createElement("div", { className: "flex gap-x-8" },
            React.createElement(Button, { onClick: onChangeClick, isDisabled: isSelectButtonDisabled },
                React.createElement(Trans, { context: "Button" }, "Select")),
            isFile ? (React.createElement(RevealFileInExplorerButton, { path: path, isDisabled: isRevealButtonDisabled })) : (React.createElement(RevealFolderInExplorerButton, { path: path, isDisabled: isRevealButtonDisabled })))));
}
//# sourceMappingURL=file-or-directory-input.js.map