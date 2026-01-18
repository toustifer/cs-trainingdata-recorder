import { db } from 'csdm/node/database/database';
import { shotRowToShot } from './shot-row-to-shot';
export async function fetchShots({ checksum, roundNumber, weaponNames }) {
    let query = db
        .selectFrom('shots')
        .selectAll()
        .leftJoin('steam_account_overrides', 'shots.player_steam_id', 'steam_account_overrides.steam_id')
        .select([db.fn.coalesce('steam_account_overrides.name', 'shots.player_name').as('player_name')])
        .where('match_checksum', '=', checksum);
    if (roundNumber !== undefined) {
        query = query.where('round_number', '=', roundNumber);
    }
    if (Array.isArray(weaponNames) && weaponNames.length > 0) {
        query = query.where('weapon_name', 'in', weaponNames);
    }
    const rows = await query.execute();
    const shots = rows.map(shotRowToShot);
    return shots;
}
//# sourceMappingURL=fetch-shots.js.map