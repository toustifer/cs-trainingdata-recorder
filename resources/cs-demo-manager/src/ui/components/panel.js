import React from 'react';
import clsx from 'clsx';
export function PanelTitle({ children }) {
    return React.createElement("p", { className: "text-body-strong" }, children);
}
export function PanelRow({ children }) {
    return React.createElement("div", { className: "flex items-center justify-between gap-x-16" }, children);
}
export const PanelValueVariant = {
    Default: 'default',
    Big: 'big',
};
export function PanelValue({ children, variant = PanelValueVariant.Default }) {
    return (React.createElement("p", { className: clsx('selectable text-gray-900', variant === PanelValueVariant.Big && 'text-title') }, children));
}
export function PanelStatRow({ title, value }) {
    return (React.createElement(PanelRow, null,
        React.createElement("p", null, title),
        React.createElement(PanelValue, null, value)));
}
export function Panel({ header, children, fitHeight, minWidth, overflowX = true }) {
    return (React.createElement("div", { className: clsx('flex min-w-[152px] flex-col rounded border border-gray-300 bg-gray-75 p-8', fitHeight ? 'h-fit' : 'h-auto', overflowX && 'overflow-x-auto'), style: {
            minWidth,
        } },
        typeof header === 'string' ? React.createElement(PanelTitle, null, header) : header,
        children && React.createElement("div", { className: "mt-12 flex h-full flex-col justify-end" }, children)));
}
//# sourceMappingURL=panel.js.map