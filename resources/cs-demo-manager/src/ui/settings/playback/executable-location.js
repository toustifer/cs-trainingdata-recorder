import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { RevealFileInExplorerButton } from 'csdm/ui/components/buttons/reveal-file-in-explorer-button';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { ResetButton } from 'csdm/ui/components/buttons/reset-button';
import { ChangeButton } from 'csdm/ui/components/buttons/change-button';
async function showSelectExecutableDialog(executableName) {
    const { filePaths, canceled } = await window.csdm.showOpenDialog({
        filters: executableName
            ? [{ extensions: window.csdm.isWindows ? ['exe'] : ['sh'], name: executableName }]
            : undefined,
        properties: ['openFile'],
    });
    if (canceled || filePaths.length === 0) {
        return;
    }
    const executablePath = filePaths[0];
    const filename = window.csdm.getPathBasename(executablePath);
    if (executableName && filename !== executableName) {
        return;
    }
    return executablePath;
}
export function ExecutableLocation({ title, description, customLocationEnabled, executablePath, updateSettings, expectedExecutableName, }) {
    const onCheckboxChange = async (event) => {
        const shouldEnableCustomLocation = event.target.checked;
        if (shouldEnableCustomLocation) {
            let newExecutablePath = executablePath;
            if (!executablePath) {
                const executablePath = await showSelectExecutableDialog(expectedExecutableName);
                if (!executablePath) {
                    return;
                }
                newExecutablePath = executablePath;
            }
            await updateSettings({
                isEnabled: true,
                executablePath: newExecutablePath,
            });
        }
        else {
            await updateSettings({
                isEnabled: false,
            });
        }
    };
    const onChangeClick = async () => {
        const executablePath = await showSelectExecutableDialog(expectedExecutableName);
        if (!executablePath) {
            return;
        }
        await updateSettings({
            executablePath,
        });
    };
    const onResetClick = async () => {
        await updateSettings({
            isEnabled: false,
            executablePath: '',
        });
    };
    return (React.createElement("div", { className: "flex flex-col border-b border-b-gray-300 py-8" },
        React.createElement("p", { className: "text-body-strong" }, title),
        React.createElement("div", { className: "mt-4 flex flex-col gap-y-4" },
            React.createElement(Checkbox, { label: React.createElement(Trans, null, "Enable custom location"), isChecked: customLocationEnabled, onChange: onCheckboxChange }),
            description,
            React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement(TextInput, { value: executablePath, isReadOnly: true }),
                React.createElement(RevealFileInExplorerButton, { path: executablePath, isDisabled: !executablePath }),
                React.createElement(ChangeButton, { isDisabled: !executablePath, onClick: onChangeClick }),
                React.createElement(ResetButton, { isDisabled: !executablePath && !customLocationEnabled, onClick: onResetClick })))));
}
//# sourceMappingURL=executable-location.js.map