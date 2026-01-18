import React, { useRef, useEffect } from 'react';
import { Content } from 'csdm/ui/components/content';
import { isSelectAllKeyboardEvent } from 'csdm/ui/keyboard/keyboard';
import { ChatMessageRow } from './chat-message';
export function ChatMessagesList({ chatMessages }) {
    const chatRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.target instanceof HTMLInputElement) {
                return;
            }
            if (isSelectAllKeyboardEvent(event)) {
                event.preventDefault();
                if (chatRef.current !== null) {
                    const selection = window.getSelection();
                    const range = document.createRange();
                    range.selectNodeContents(chatRef.current);
                    if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    return (React.createElement(Content, null,
        React.createElement("div", { className: "select-text", ref: chatRef }, chatMessages.map((chat) => {
            return React.createElement(ChatMessageRow, { key: chat.id, chatMessage: chat });
        }))));
}
//# sourceMappingURL=chat-messages-list.js.map