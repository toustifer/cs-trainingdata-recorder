import React from 'react';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function LeftBarTooltip({ children, content }) {
    return (React.createElement(Tooltip, { content: content, placement: "right" }, children));
}
//# sourceMappingURL=left-bar-tooltip.js.map