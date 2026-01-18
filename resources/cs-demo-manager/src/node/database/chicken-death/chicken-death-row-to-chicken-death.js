export function chickenDeathRowToChickenDeath(row) {
    return {
        id: row.id,
        frame: row.frame,
        tick: row.tick,
        matchChecksum: row.match_checksum,
        roundNumber: row.round_number,
        killerSteamId: row.killer_steam_id,
        weaponName: row.weapon_name,
    };
}
//# sourceMappingURL=chicken-death-row-to-chicken-death.js.map