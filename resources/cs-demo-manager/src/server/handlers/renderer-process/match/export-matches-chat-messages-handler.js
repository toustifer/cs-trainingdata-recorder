import { exportMatchesChatMessages } from 'csdm/node/chat-messages/export-matches-chat-messages';
import { handleError } from '../../handle-error';
export async function exportMatchesChatMessagesHandler({ checksums, outputFolderPath, }) {
    try {
        return await exportMatchesChatMessages(checksums, outputFolderPath);
    }
    catch (error) {
        handleError(error, 'Error while exporting matches chat messages');
    }
}
//# sourceMappingURL=export-matches-chat-messages-handler.js.map