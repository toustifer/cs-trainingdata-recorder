import { db } from 'csdm/node/database/database';
export async function fetchPlayerSteamIdsInMatch(checksum) {
    const rows = await db.selectFrom('players').select('steam_id').where('match_checksum', '=', checksum).execute();
    return rows.map((row) => row.steam_id);
}
//# sourceMappingURL=fetch-player-steam-ids-in-match.js.map