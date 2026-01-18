import { fetchChatMessages } from '../database/chat-messages/fetch-chat-messages';
import { writeChatMessagesToFile } from './write-chat-messages-to-file';
export async function exportMatchChatMessages(checksum, filePath, messages) {
    let chatMessages;
    if (!messages) {
        chatMessages = await fetchChatMessages(checksum);
    }
    else {
        chatMessages = messages;
    }
    return await writeChatMessagesToFile(chatMessages, filePath);
}
//# sourceMappingURL=export-match-chat-messages.js.map