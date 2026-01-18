import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useShowToast } from '../components/toasts/use-show-toast';
import { useWebSocketClient } from './use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
export function useExportMatchChatMessages() {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const { t } = useLingui();
    return async (checksum, messages) => {
        const options = {
            defaultPath: `messages-${checksum}.txt`,
            title: t({
                context: 'OS save dialog title',
                message: 'Export',
            }),
            filters: [{ name: 'TXT', extensions: ['txt'] }],
        };
        const { canceled, filePath } = await window.csdm.showSaveDialog(options);
        if (canceled || filePath === undefined) {
            return;
        }
        try {
            const payload = {
                checksum,
                filePath,
                messages,
            };
            const hasMessages = await client.send({
                name: RendererClientMessageName.ExportMatchChatMessages,
                payload,
            });
            if (hasMessages) {
                showToast({
                    content: React.createElement(Trans, null, "Chat messages exported, click here to reveal the file"),
                    type: 'success',
                    onClick: () => {
                        window.csdm.browseToFile(filePath);
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
}
//# sourceMappingURL=use-export-match-chat-messages.js.map