import React from 'react';
import { useNavigateToDemo } from 'csdm/ui/hooks/use-navigate-to-demo';
export function DropZone({ children }) {
    const navigateToDemo = useNavigateToDemo();
    const onDragOver = (event) => {
        event.preventDefault();
    };
    const onDrop = (event) => {
        event.preventDefault();
        for (const file of event.dataTransfer.files) {
            const path = window.csdm.getWebFilePath(file);
            if (path.endsWith('.dem')) {
                navigateToDemo(path);
                break;
            }
        }
    };
    return (React.createElement("div", { onDragOver: onDragOver, onDrop: onDrop }, children));
}
//# sourceMappingURL=drop-zone.js.map