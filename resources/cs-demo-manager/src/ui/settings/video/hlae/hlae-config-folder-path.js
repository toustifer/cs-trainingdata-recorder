import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { RevealFolderInExplorerButton } from 'csdm/ui/components/buttons/reveal-folder-in-explorer-button';
import { useHlaeSettings } from 'csdm/ui/settings/video/hlae/use-hlae-settings';
import { ChangeButton } from 'csdm/ui/components/buttons/change-button';
import { ResetButton } from 'csdm/ui/components/buttons/reset-button';
async function showSelectFolderDialog() {
    const options = { properties: ['openDirectory'] };
    const { filePaths } = await window.csdm.showOpenDialog(options);
    if (filePaths.length > 0) {
        return filePaths[0];
    }
}
export function HlaeConfigFolderPath() {
    const { hlaeSettings, updateHlaeSettings } = useHlaeSettings();
    const { configFolderPath, configFolderEnabled } = hlaeSettings;
    const onChangeClick = async () => {
        const folderPath = await showSelectFolderDialog();
        if (folderPath !== undefined) {
            await updateHlaeSettings({
                configFolderEnabled: true,
                configFolderPath: folderPath,
            });
        }
    };
    const onResetClick = async () => {
        await updateHlaeSettings({
            configFolderEnabled: false,
            configFolderPath: '',
        });
    };
    const onCheckboxChange = async (event) => {
        const shouldEnableConfigFolder = event.target.checked;
        let newFolderPath = configFolderPath;
        if (shouldEnableConfigFolder && configFolderPath === '') {
            newFolderPath = await showSelectFolderDialog();
            if (newFolderPath === undefined) {
                return;
            }
        }
        await updateHlaeSettings({
            configFolderEnabled: shouldEnableConfigFolder,
            configFolderPath: newFolderPath,
        });
    };
    const isFolderPathEmpty = configFolderPath === '';
    return (React.createElement("div", { className: "flex flex-col gap-y-4" },
        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Enable config folder"), isChecked: configFolderEnabled, onChange: onCheckboxChange }),
        React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement(TextInput, { value: configFolderPath, isReadOnly: true }),
            React.createElement(RevealFolderInExplorerButton, { path: configFolderPath, isDisabled: isFolderPathEmpty }),
            React.createElement(ChangeButton, { isDisabled: isFolderPathEmpty, onClick: onChangeClick }),
            React.createElement(ResetButton, { isDisabled: isFolderPathEmpty, onClick: onResetClick }))));
}
//# sourceMappingURL=hlae-config-folder-path.js.map