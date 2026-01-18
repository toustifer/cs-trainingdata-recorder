import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Popover, PopoverContent, PopoverTrigger } from 'csdm/ui/components/popover/popover';
import { useViewerContext } from '../use-viewer-context';
import { PlaybackBarButton } from './playback-bar-button';
import { PencilIcon } from 'csdm/ui/icons/pencil-icon';
import { RangeInput } from 'csdm/ui/components/inputs/range-input';
import { EraserIcon } from 'csdm/ui/icons/eraser-icon';
import { Button } from 'csdm/ui/components/buttons/button';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { KeyboardKey, KeyboardKeys } from 'csdm/ui/components/keyboard-keys';
import { modifierKey } from 'csdm/ui/keyboard/keyboard-shortcut';
function ToolButton({ children, onClick, isSelected, tooltip, }) {
    return (React.createElement(Tooltip, { content: tooltip, placement: "top" },
        React.createElement("button", { onClick: onClick, className: clsx('flex cursor-pointer items-center justify-center rounded-4 p-4 text-gray-900 transition-colors duration-200', isSelected ? 'bg-gray-400' : 'bg-gray-75') }, children)));
}
function ColorButton({ color, selected, onClick }) {
    return (React.createElement("button", { className: clsx('size-32 cursor-pointer border-2 border-white outline-3', selected ? `scale-110 rounded-8 outline-blue-700 transition-all duration-200` : `rounded-4 outline-transparent`), style: { backgroundColor: color }, onClick: onClick }));
}
function DrawingPopover({ drawing }) {
    const { drawingTool, setDrawingTool, drawingSize, setDrawingSize, drawingColor, setDrawingColor, toggleMode, isDrawingMode, } = useViewerContext();
    const colors = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffa500', '#800080'];
    return (React.createElement("div", { className: "flex w-[24rem] flex-col gap-y-16 rounded-8 bg-gray-100 p-16" },
        React.createElement("div", { className: "flex gap-x-16" },
            React.createElement("div", { className: "flex flex-col gap-y-16" },
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Tool")),
                    React.createElement("div", { className: "flex items-center gap-x-8" },
                        React.createElement(ToolButton, { onClick: () => setDrawingTool('pen'), isSelected: drawingTool === 'pen', tooltip: React.createElement(Trans, null, "Pen") },
                            React.createElement(PencilIcon, { className: "size-32" })),
                        React.createElement(ToolButton, { onClick: () => setDrawingTool('eraser'), isSelected: drawingTool === 'eraser', tooltip: React.createElement(Trans, null, "Eraser") },
                            React.createElement(EraserIcon, { className: "size-32" })))),
                React.createElement("div", { className: "flex w-[11rem] flex-col gap-y-8" },
                    React.createElement("div", { className: "flex items-end gap-x-8" },
                        React.createElement(RangeInput, { label: React.createElement(Trans, null, "Size"), min: 1, max: 10, onChange: setDrawingSize, value: drawingSize }),
                        React.createElement("p", { className: "text-body-strong" }, drawingSize)))),
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "Color")),
                React.createElement("div", { className: "flex flex-wrap gap-12" }, colors.map((color) => (React.createElement(ColorButton, { key: color, color: color, selected: color === drawingColor, onClick: () => {
                        setDrawingColor(color);
                    } })))))),
        React.createElement("div", { className: "flex flex-wrap items-center gap-8" },
            React.createElement(Tooltip, { content: React.createElement(KeyboardKeys, null,
                    React.createElement(KeyboardKey, null, modifierKey),
                    React.createElement(KeyboardKey, null, "Z")), placement: "top" },
                React.createElement(Button, { onClick: drawing.undo },
                    React.createElement(Trans, null, "Undo"))),
            React.createElement(Tooltip, { content: React.createElement(KeyboardKeys, null,
                    React.createElement(KeyboardKey, null, modifierKey),
                    React.createElement(KeyboardKey, null, "Shift"),
                    React.createElement(KeyboardKey, null, "Z")), placement: "top" },
                React.createElement(Button, { onClick: drawing.redo },
                    React.createElement(Trans, null, "Redo"))),
            React.createElement(Tooltip, { content: React.createElement(KeyboardKeys, null,
                    React.createElement(KeyboardKey, null, modifierKey),
                    React.createElement(KeyboardKey, null, "X")), placement: "top" },
                React.createElement(Button, { onClick: drawing.clear },
                    React.createElement(Trans, null, "Clear")))),
        React.createElement("div", null,
            React.createElement(Tooltip, { content: React.createElement(KeyboardKey, null, "D"), placement: "top" },
                React.createElement(Button, { onClick: toggleMode }, isDrawingMode ? React.createElement(Trans, null, "Stop drawing") : React.createElement(Trans, null, "Start drawing"))))));
}
export function DrawingButton({ drawing }) {
    const { mode, toggleMode } = useViewerContext();
    return (React.createElement(Popover, { openOnHover: true, closeDelay: 300 },
        React.createElement(PopoverTrigger, { asChild: true },
            React.createElement(PlaybackBarButton, { onClick: toggleMode },
                React.createElement(PencilIcon, { className: clsx('size-20', mode === 'drawing' && 'text-red-700') }))),
        React.createElement(PopoverContent, null,
            React.createElement(DrawingPopover, { drawing: drawing }))));
}
//# sourceMappingURL=drawing-button.js.map