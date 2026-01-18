import { db } from 'csdm/node/database/database';
import { playerBlindRowToPlayerBlind } from './player-blind-row-to-player-blind';
export async function fetchPlayerBlinds(checksum) {
    const rows = await db.selectFrom('player_blinds').selectAll().where('match_checksum', '=', checksum).execute();
    const playerBlinds = rows.map((row) => {
        return playerBlindRowToPlayerBlind(row);
    });
    return playerBlinds;
}
//# sourceMappingURL=fetch-player-blinds.js.map