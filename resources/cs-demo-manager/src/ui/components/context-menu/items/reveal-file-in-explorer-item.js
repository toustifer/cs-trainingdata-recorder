import React from 'react';
import { Select } from '@lingui/react/macro';
import { ContextMenuItem } from '../context-menu-item';
export function RevealFileInExplorerItem({ filePath, onFileNotFound }) {
    const onClick = async () => {
        const fileExists = await window.csdm.pathExists(filePath);
        if (!fileExists) {
            onFileNotFound(filePath);
            return;
        }
        window.csdm.browseToFile(filePath);
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Select, { value: window.csdm.platform, _darwin: "Reveal in Finder", _win32: "Reveal in Explorer", other: "Reveal in files explorer" })));
}
//# sourceMappingURL=reveal-file-in-explorer-item.js.map