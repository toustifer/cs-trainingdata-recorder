import React from 'react';
import { Tooltip } from '../tooltip';
function Circle({ ref, color, top }) {
    return (React.createElement("div", { ref: ref, className: "size-8 rounded-full border", style: {
            position: top ? 'absolute' : 'relative',
            top: top ? `${top}px` : undefined,
            backgroundColor: color,
        } }));
}
export function TagIndicator({ tag, top }) {
    return (React.createElement(Tooltip, { content: tag.name, key: tag.id, renderInPortal: true },
        React.createElement(Circle, { color: tag.color, top: top })));
}
//# sourceMappingURL=tag-indicator.js.map