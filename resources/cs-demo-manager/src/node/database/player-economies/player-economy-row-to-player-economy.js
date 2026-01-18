export function playerEconomyRowToPlayerEconomy(row) {
    return {
        id: row.id,
        matchChecksum: row.match_checksum,
        roundNumber: row.round_number,
        playerSteamId: row.player_steam_id,
        playerSide: row.player_side,
        equipmentValue: row.equipment_value,
        moneySpent: row.money_spent,
        playerName: row.player_name,
        startMoney: row.start_money,
        type: row.type,
    };
}
//# sourceMappingURL=player-economy-row-to-player-economy.js.map