import { DragIcon } from 'csdm/ui/icons/drag-icon';
import React from 'react';
export function ImageDropZone({ onDrop, onClick, width, height, src }) {
    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };
    return (React.createElement("div", { className: "flex cursor-pointer items-center justify-center border border-gray-300", onClick: onClick, onDrop: onDrop, onDragOver: onDragOver, style: { width: width ? `${width}px` : 200, height: height ? `${height}px` : 200 } }, src ? React.createElement("img", { src: src, className: "size-full" }) : React.createElement(DragIcon, { width: 100 })));
}
//# sourceMappingURL=image-drop-zone.js.map