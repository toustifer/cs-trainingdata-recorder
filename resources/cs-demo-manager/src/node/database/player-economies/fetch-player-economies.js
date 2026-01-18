import { db } from 'csdm/node/database/database';
import { playerEconomyRowToPlayerEconomy } from './player-economy-row-to-player-economy';
export async function fetchPlayersEconomies(checksum) {
    const query = db
        .selectFrom('player_economies')
        .selectAll()
        .where('match_checksum', '=', checksum)
        .orderBy('round_number', 'asc');
    const rows = await query.execute();
    const playersEconomy = rows.map((row) => {
        return playerEconomyRowToPlayerEconomy(row);
    });
    return playersEconomy;
}
//# sourceMappingURL=fetch-player-economies.js.map