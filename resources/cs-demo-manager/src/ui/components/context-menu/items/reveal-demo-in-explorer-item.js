import React from 'react';
import { RevealFileInExplorerItem } from './reveal-file-in-explorer-item';
export function RevealDemoInExplorerItem({ checksum, demoPath, onDemoNotFound }) {
    const onFileNotFound = () => {
        onDemoNotFound(demoPath, checksum);
    };
    return React.createElement(RevealFileInExplorerItem, { filePath: demoPath, onFileNotFound: onFileNotFound });
}
//# sourceMappingURL=reveal-demo-in-explorer-item.js.map