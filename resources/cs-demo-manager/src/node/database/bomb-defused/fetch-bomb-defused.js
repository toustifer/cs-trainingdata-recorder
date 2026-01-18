import { db } from 'csdm/node/database/database';
import { bombDefusedRowToBombDefused } from './bomb-defused-row-to-bomb-defused';
export async function fetchBombDefused(checksum, roundNumber) {
    const row = await db
        .selectFrom('bombs_defused')
        .selectAll()
        .leftJoin('steam_account_overrides', 'bombs_defused.defuser_steam_id', 'steam_account_overrides.steam_id')
        .select([db.fn.coalesce('steam_account_overrides.name', 'bombs_defused.defuser_name').as('defuser_name')])
        .where('match_checksum', '=', checksum)
        .where('round_number', '=', roundNumber)
        .orderBy('tick')
        .executeTakeFirst();
    let bombDefused = null;
    if (row !== undefined) {
        bombDefused = bombDefusedRowToBombDefused(row);
    }
    return bombDefused;
}
//# sourceMappingURL=fetch-bomb-defused.js.map