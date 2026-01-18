import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useHlaeSettings } from 'csdm/ui/settings/video/hlae/use-hlae-settings';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { FileOrDirectoryInput } from 'csdm/ui/components/inputs/file-or-directory-input';
export function HlaeConfigFolderPath() {
    const { t } = useLingui();
    const { hlaeSettings, updateHlaeSettings } = useHlaeSettings();
    const { configFolderPath, configFolderEnabled } = hlaeSettings;
    const updateConfigFolderPath = async (folderPath) => {
        await updateHlaeSettings({
            configFolderPath: folderPath,
        });
    };
    const showSelectFolderDialog = async () => {
        const options = { properties: ['openDirectory'] };
        const { filePaths } = await window.csdm.showOpenDialog(options);
        if (filePaths.length > 0) {
            const [folder] = filePaths;
            await updateConfigFolderPath(folder);
            return true;
        }
        return false;
    };
    const onEnableChange = async (event) => {
        const isChecked = event.target.checked;
        const folderExists = await window.csdm.pathExists(configFolderPath);
        if (isChecked && !folderExists) {
            const isValidPath = await showSelectFolderDialog();
            if (isValidPath) {
                await updateHlaeSettings({
                    configFolderEnabled: isChecked,
                });
            }
        }
        else {
            await updateHlaeSettings({
                configFolderEnabled: isChecked,
            });
        }
    };
    return (React.createElement("div", null,
        React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Enable config folder"), isChecked: configFolderEnabled, onChange: onEnableChange }),
        React.createElement(FileOrDirectoryInput, { type: "folder", label: React.createElement(Trans, { context: "Input label" }, "Config folder"), placeholder: t `Config folder`, dialogTitle: t `Select config folder`, path: configFolderPath, isInputDisabled: !configFolderEnabled, isSelectButtonDisabled: !configFolderEnabled, isRevealButtonDisabled: !configFolderEnabled, onFileSelected: updateConfigFolderPath })));
}
//# sourceMappingURL=hlae-config-folder-path.js.map