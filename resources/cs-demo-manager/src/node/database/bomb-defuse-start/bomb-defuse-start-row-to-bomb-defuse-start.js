export function bombDefuseStartRowToBombDefuseStart(row) {
    return {
        id: row.id,
        matchChecksum: row.match_checksum,
        tick: row.tick,
        frame: row.frame,
        roundNumber: row.round_number,
        isDefuserControllingBot: row.is_defuser_controlling_bot,
        defuserName: row.defuser_name,
        defuserSteamId: row.defuser_steam_id,
        x: row.x,
        y: row.y,
        z: row.z,
    };
}
//# sourceMappingURL=bomb-defuse-start-row-to-bomb-defuse-start.js.map