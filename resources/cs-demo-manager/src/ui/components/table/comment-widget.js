import React, { useRef } from 'react';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { MarkdownEditor } from '../inputs/markdown-editor';
import { editorViewCtx } from '@milkdown/kit/core';
export function TableCommentWidget({ onClose, comment, onBlur }) {
    const editorRef = useRef(null);
    const activeElementOnMount = useRef(document.activeElement);
    const onKeyDown = (event) => {
        if (editorRef.current && event.key === 'Tab') {
            const view = editorRef.current.ctx.get(editorViewCtx);
            if (document.activeElement !== view.dom) {
                event.preventDefault();
                view.focus();
            }
        }
    };
    const onReady = (editor) => {
        editorRef.current = editor;
        window.addEventListener('keydown', onKeyDown);
    };
    const onDestroy = () => {
        if (activeElementOnMount.current instanceof HTMLElement) {
            activeElementOnMount.current.focus();
        }
        window.removeEventListener('keydown', onKeyDown);
    };
    return (React.createElement("div", { className: "absolute top-[84px] right-16 z-1 flex flex-col gap-y-8 rounded-8 border border-gray-300 bg-gray-75 p-16 shadow-[0_0_4px_0_var(--color-gray-500)]" },
        React.createElement("div", { className: "h-[300px] w-[500px]" },
            React.createElement(MarkdownEditor, { defaultValue: comment, onReady: onReady, onDestroy: onDestroy, onBlur: onBlur })),
        React.createElement("div", null,
            React.createElement(CloseButton, { onClick: onClose }))));
}
//# sourceMappingURL=comment-widget.js.map