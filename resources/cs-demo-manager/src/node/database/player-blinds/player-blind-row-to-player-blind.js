export function playerBlindRowToPlayerBlind(row) {
    return {
        id: row.id,
        matchChecksum: row.match_checksum,
        tick: row.tick,
        frame: row.frame,
        roundNumber: row.round_number,
        duration: row.duration,
        flashedName: row.flashed_name,
        flashedSteamId: row.flashed_steam_id,
        flashedSide: row.flashed_side,
        isFlashedControllingBot: row.is_flashed_controlling_bot,
        flasherName: row.flasher_name,
        flasherSteamId: row.flasher_steam_id,
        flasherSide: row.flasher_side,
        isFlasherControllingBot: row.is_flasher_controlling_bot,
    };
}
//# sourceMappingURL=player-blind-row-to-player-blind.js.map