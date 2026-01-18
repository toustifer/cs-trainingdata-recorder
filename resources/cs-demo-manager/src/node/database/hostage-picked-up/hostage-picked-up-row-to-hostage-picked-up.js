export function hostagePickedUpRowToHostagePickedUp(row) {
    return {
        id: row.id,
        frame: row.frame,
        matchChecksum: row.match_checksum,
        roundNumber: row.round_number,
        playerSteamId: row.player_steam_id,
        isPlayerControllingBot: row.is_player_controlling_bot,
        hostageEntityId: row.hostage_entity_id,
        tick: row.tick,
        x: row.x,
        y: row.y,
        z: row.z,
    };
}
//# sourceMappingURL=hostage-picked-up-row-to-hostage-picked-up.js.map