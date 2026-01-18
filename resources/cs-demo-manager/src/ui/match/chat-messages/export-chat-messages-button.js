import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useExportMatchChatMessages } from 'csdm/ui/hooks/use-export-match-chat-messages';
export function ExportChatMessagesButton({ checksum, messages }) {
    const exportMessages = useExportMatchChatMessages();
    const onClick = () => {
        exportMessages(checksum, messages);
    };
    return (React.createElement(Button, { onClick: onClick, isDisabled: messages.length === 0 },
        React.createElement(Trans, { context: "Button" }, "Export")));
}
//# sourceMappingURL=export-chat-messages-button.js.map