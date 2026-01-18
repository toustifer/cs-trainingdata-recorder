import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { FoldersList } from './folders-list';
import { AddFolderButton } from './add-folder-button';
export function FoldersSettings() {
    return (React.createElement(SettingsView, null,
        React.createElement(AddFolderButton, null),
        React.createElement(FoldersList, null)));
}
//# sourceMappingURL=folders-settings.js.map