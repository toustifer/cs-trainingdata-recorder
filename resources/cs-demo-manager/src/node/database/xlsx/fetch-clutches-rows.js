import { db } from 'csdm/node/database/database';
export async function fetchClutchesRows(checksums) {
    const rows = await db
        .selectFrom('clutches')
        .where('match_checksum', 'in', checksums)
        .select([
        'match_checksum as matchChecksum',
        'round_number as roundNumber',
        'tick',
        'clutcher_name as playerName',
        'clutcher_steam_id as playerSteamId',
        'side as playerSide',
        'won as hasWon',
        'opponent_count as opponentCount',
        'clutcher_kill_count as killCount',
    ])
        .execute();
    return rows;
}
//# sourceMappingURL=fetch-clutches-rows.js.map