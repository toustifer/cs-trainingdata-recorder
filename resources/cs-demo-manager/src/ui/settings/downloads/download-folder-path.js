import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RevealFolderInExplorerButton } from 'csdm/ui/components/buttons/reveal-folder-in-explorer-button';
import { useDownloadFolderPath } from './use-download-folder-path';
import { useShowDownloadFolderDialog } from './use-show-download-folder-dialog';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { ChangeButton } from 'csdm/ui/components/buttons/change-button';
export function DownloadFolderPath() {
    const downloadFolderPath = useDownloadFolderPath();
    const showDownloadFolderDialog = useShowDownloadFolderDialog();
    return (React.createElement("div", null,
        React.createElement("p", { className: "text-body-strong" },
            React.createElement(Trans, null, "Download folder")),
        React.createElement("div", { className: "mt-8 flex gap-x-8" },
            React.createElement(TextInput, { value: downloadFolderPath, isReadOnly: true }),
            downloadFolderPath !== undefined && React.createElement(RevealFolderInExplorerButton, { path: downloadFolderPath }),
            React.createElement(ChangeButton, { onClick: showDownloadFolderDialog }))));
}
//# sourceMappingURL=download-folder-path.js.map