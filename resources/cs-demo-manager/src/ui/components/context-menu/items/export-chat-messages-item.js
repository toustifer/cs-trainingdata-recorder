import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useShowToast } from '../../toasts/use-show-toast';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useExportMatchChatMessages } from 'csdm/ui/hooks/use-export-match-chat-messages';
export function ExportChatMessagesItem({ checksums }) {
    const { t } = useLingui();
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const exportChatMessages = useExportMatchChatMessages();
    const onClick = async () => {
        if (checksums.length === 1) {
            return exportChatMessages(checksums[0]);
        }
        const { filePaths, canceled } = await window.csdm.showOpenDialog({
            buttonLabel: t({
                context: 'Button label',
                message: 'Select',
            }),
            properties: ['openDirectory'],
        });
        if (canceled || filePaths.length === 0) {
            return;
        }
        const outputFolderPath = filePaths[0];
        try {
            const payload = {
                checksums,
                outputFolderPath,
            };
            const hasExportedAtLeastOneMatch = await client.send({
                name: RendererClientMessageName.ExportMatchesChatMessages,
                payload,
            });
            if (hasExportedAtLeastOneMatch) {
                showToast({
                    content: React.createElement(Trans, { context: "Toast" }, "Chat messages exported, click here to reveal the folder"),
                    type: 'success',
                    onClick: () => {
                        window.csdm.browseToFolder(outputFolderPath);
                    },
                });
            }
            else {
                showToast({
                    content: React.createElement(Trans, null, "No chat messages to export"),
                    type: 'warning',
                });
            }
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                type: 'error',
            });
        }
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: checksums.length === 0 },
        React.createElement(Trans, { context: "Context menu" }, "Chat messages")));
}
//# sourceMappingURL=export-chat-messages-item.js.map