import React from 'react';
import { Tooltip } from '../tooltip';
import { QuestionIcon } from 'csdm/ui/icons/question-icon';
export function InputLabel({ children, helpTooltip, ...props }) {
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement("label", { ...props }, children),
        helpTooltip !== undefined && (React.createElement(Tooltip, { content: helpTooltip },
            React.createElement(QuestionIcon, { height: 12 })))));
}
//# sourceMappingURL=input-label.js.map