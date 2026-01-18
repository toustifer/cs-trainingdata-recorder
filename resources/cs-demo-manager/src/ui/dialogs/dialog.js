import React, { useEffect, useRef } from 'react';
import { useBlockNavigation } from 'csdm/ui/hooks/use-block-navigation';
import { useDialog } from '../components/dialogs/use-dialog';
export function Dialog({ id, onClose, closeOnBackgroundClicked = true, closeOnEscPressed = true, children, onEnterPressed, blockNavigation = true, }) {
    const container = useRef(null);
    useBlockNavigation(blockNavigation);
    const { hideDialog } = useDialog();
    const handleClose = () => {
        onClose?.();
        hideDialog();
    };
    const onKeyDown = (event) => {
        event.stopPropagation();
        switch (event.key) {
            case 'Escape':
                if (closeOnEscPressed) {
                    handleClose();
                }
                break;
            case 'Enter':
                if (typeof onEnterPressed === 'function') {
                    onEnterPressed(event);
                }
                break;
        }
    };
    const onMouseDown = (event) => {
        event.stopPropagation();
    };
    const onBackgroundLayerClick = (event) => {
        event.stopPropagation();
        const isMouseLeftClick = event.button === 0;
        if (isMouseLeftClick && closeOnBackgroundClicked) {
            handleClose();
        }
    };
    useEffect(() => {
        container.current?.focus();
    }, [container]);
    return (React.createElement("div", { id: id, className: "absolute inset-0 flex items-center justify-center bg-black/75 pt-[var(--title-bar-height)]", onMouseDown: onBackgroundLayerClick },
        React.createElement("div", { ref: container, className: "flex max-h-[calc(100vh-140px)] min-w-[524px] flex-col overflow-y-auto rounded bg-gray-50 text-gray-800 shadow-[0_0_0_1px_var(--color-gray-300)] focus-visible:outline-hidden", tabIndex: -1, onMouseDown: onMouseDown, onKeyDown: onKeyDown, role: "dialog", "aria-modal": "true" }, children)));
}
export function DialogContent({ children }) {
    return React.createElement("div", { className: "flex flex-col px-24 pt-12 pb-24" }, children);
}
export function DialogHeader({ children }) {
    return React.createElement("header", { className: "px-24 pt-24" }, children);
}
export function DialogFooter({ children }) {
    return (React.createElement("footer", { className: "flex flex-1 items-center justify-end gap-x-8 border-t border-gray-200 p-24" }, children));
}
export function DialogTitle({ children }) {
    return React.createElement("h1", { className: "text-subtitle" }, children);
}
//# sourceMappingURL=dialog.js.map