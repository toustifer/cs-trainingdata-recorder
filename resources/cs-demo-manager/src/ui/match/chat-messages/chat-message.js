import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TeamText } from 'csdm/ui/components/team-text';
export function ChatMessageRow({ chatMessage }) {
    const { senderName, senderSide, senderIsAlive, message } = chatMessage;
    const playerStatus = senderIsAlive ? '' : React.createElement(Trans, { context: "Chat message status" }, "*DEAD*");
    return (React.createElement("div", null,
        React.createElement(TeamText, { teamNumber: senderSide, className: "select-text" },
            playerStatus,
            " ",
            senderName),
        React.createElement("span", { className: "select-text" }, ": "),
        React.createElement("span", { className: "select-text" }, message)));
}
//# sourceMappingURL=chat-message.js.map