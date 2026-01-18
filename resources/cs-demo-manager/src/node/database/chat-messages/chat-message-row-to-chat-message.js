export function chatMessageRowToChatMessage(row) {
    return {
        id: row.id,
        matchChecksum: row.match_checksum,
        tick: row.tick,
        frame: row.frame,
        roundNumber: row.round_number,
        message: row.message,
        senderIsAlive: row.sender_is_alive,
        senderName: row.sender_name,
        senderSide: row.sender_side,
        senderSteamId: row.sender_steam_id,
    };
}
//# sourceMappingURL=chat-message-row-to-chat-message.js.map