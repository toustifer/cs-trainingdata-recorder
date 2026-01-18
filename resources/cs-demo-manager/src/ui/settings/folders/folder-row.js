import React from 'react';
import { Trans } from '@lingui/react/macro';
import { IncludeSubFoldersSwitch } from './include-sub-folders-switch';
import { RemoveFolderButton } from './remove-folder-button';
import { RevealFolderInExplorerButton } from 'csdm/ui/components/buttons/reveal-folder-in-explorer-button';
import { pathContainsInvalidCsgoChars } from 'csdm/common/string/path-contains-invalid-csgo-chars';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
export function FolderRow({ folder }) {
    return (React.createElement("div", { className: "flex flex-col rounded border border-gray-300 p-8" },
        React.createElement("p", { className: "selectable font-semibold" }, folder.path),
        React.createElement("div", { className: "mt-4 flex items-center justify-between" },
            React.createElement(IncludeSubFoldersSwitch, { folder: folder }),
            React.createElement("div", { className: "flex gap-x-8" },
                React.createElement(RevealFolderInExplorerButton, { path: folder.path }),
                React.createElement(RemoveFolderButton, { folderPath: folder.path }))),
        pathContainsInvalidCsgoChars(folder.path) && (React.createElement("div", { className: "mt-4 flex items-center gap-x-4" },
            React.createElement(ExclamationTriangleIcon, { className: "size-12 text-orange-700" }),
            React.createElement("p", { className: "text-caption" },
                React.createElement(Trans, null, "This folder contains characters that will prevent demo playback when starting CS:GO! (not CS2)"))))));
}
//# sourceMappingURL=folder-row.js.map