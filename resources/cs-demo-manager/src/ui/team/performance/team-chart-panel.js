import React, {} from 'react';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { QuestionIcon } from 'csdm/ui/icons/question-icon';
export function TeamChartPanelHeader({ title, tooltip }) {
    return (React.createElement("div", { className: "mb-8 flex items-center gap-x-12" },
        React.createElement("h3", { className: "text-body-strong" }, title),
        tooltip && (React.createElement(Tooltip, { content: React.createElement("p", null, tooltip) },
            React.createElement("div", { className: "flex size-20 items-center justify-center rounded-full bg-gray-400 p-4" },
                React.createElement(QuestionIcon, { className: "size-12" }))))));
}
export function TeamChart({ ref }) {
    return React.createElement("div", { className: "min-h-[280px] min-w-[400px]", ref: ref });
}
export function TeamChartPanel({ children }) {
    return React.createElement("div", { className: "flex flex-col rounded border border-gray-300 bg-gray-100 p-8" }, children);
}
//# sourceMappingURL=team-chart-panel.js.map