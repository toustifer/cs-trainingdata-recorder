import { handleError } from '../../handle-error';
import { exportMatchChatMessages } from 'csdm/node/chat-messages/export-match-chat-messages';
export async function exportMatchChatMessagesHandler({ checksum, filePath, messages }) {
    try {
        return await exportMatchChatMessages(checksum, filePath, messages);
    }
    catch (error) {
        handleError(error, 'Error while exporting chat messages');
    }
}
//# sourceMappingURL=export-match-chat-messages-handler.js.map