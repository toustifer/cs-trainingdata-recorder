import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Switch } from 'csdm/ui/components/inputs/switch';
import { useToggleFolderSubFoldersInclusion } from './use-toggle-folder-sub-folders-inclusion';
export function IncludeSubFoldersSwitch({ folder }) {
    const toggleFolderSubFoldersInclusion = useToggleFolderSubFoldersInclusion();
    const onChange = async (isChecked) => {
        await toggleFolderSubFoldersInclusion(folder.path, isChecked);
    };
    const id = `include-sub-folders-${folder.path}`;
    return (React.createElement("div", { className: "flex items-center gap-x-12" },
        React.createElement("label", { htmlFor: id },
            React.createElement(Trans, null, "Include subfolders")),
        React.createElement(Switch, { id: id, isChecked: folder.includeSubFolders, onChange: onChange })));
}
//# sourceMappingURL=include-sub-folders-switch.js.map