import fs from 'fs-extra';
function formatChatMessage(chatMessage) {
    const { senderIsAlive, senderName, message } = chatMessage;
    const playerStatus = senderIsAlive ? '' : '*DEAD* ';
    return `${playerStatus}${senderName} : ${message}`;
}
export async function writeChatMessagesToFile(messages, filePath) {
    if (messages.length === 0) {
        return false;
    }
    const formattedChatMessages = messages.map(formatChatMessage);
    const text = formattedChatMessages.join('\n');
    await fs.writeFile(filePath, text);
    return true;
}
//# sourceMappingURL=write-chat-messages-to-file.js.map