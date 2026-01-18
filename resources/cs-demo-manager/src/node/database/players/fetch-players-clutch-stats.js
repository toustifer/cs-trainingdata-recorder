import { db } from 'csdm/node/database/database';
import { sql } from 'kysely';
export async function fetchPlayersClutchStats(checksums, steamIds) {
    const { count } = db.fn;
    let query = db
        .selectFrom('clutches')
        .select([
        'clutcher_steam_id as clutcherSteamId',
        count('id').as('totalCount'),
        sql `COUNT(CASE WHEN opponent_count = 1 THEN 1 END)`.as('vsOneCount'),
        sql `COUNT(CASE WHEN opponent_count = 1 AND won = TRUE THEN 1 END)`.as('vsOneWonCount'),
        sql `COUNT(CASE WHEN opponent_count = 1 AND won = FALSE THEN 1 END)`.as('vsOneLostCount'),
        sql `COUNT(CASE WHEN opponent_count = 2 THEN 1 END)`.as('vsTwoCount'),
        sql `COUNT(CASE WHEN opponent_count = 2 AND won = TRUE THEN 1 END)`.as('vsTwoWonCount'),
        sql `COUNT(CASE WHEN opponent_count = 2 AND won = FALSE THEN 1 END)`.as('vsTwoLostCount'),
        sql `COUNT(CASE WHEN opponent_count = 3 THEN 1 END)`.as('vsThreeCount'),
        sql `COUNT(CASE WHEN opponent_count = 3 AND won = TRUE THEN 1 END)`.as('vsThreeWonCount'),
        sql `COUNT(CASE WHEN opponent_count = 3 AND won = FALSE THEN 1 END)`.as('vsThreeLostCount'),
        sql `COUNT(CASE WHEN opponent_count = 4 THEN 1 END)`.as('vsFourCount'),
        sql `COUNT(CASE WHEN opponent_count = 4 AND won = TRUE THEN 1 END)`.as('vsFourWonCount'),
        sql `COUNT(CASE WHEN opponent_count = 4 AND won = FALSE THEN 1 END)`.as('vsFourLostCount'),
        sql `COUNT(CASE WHEN opponent_count = 5 THEN 1 END)`.as('vsFiveCount'),
        sql `COUNT(CASE WHEN opponent_count = 5 AND won = TRUE THEN 1 END)`.as('vsFiveWonCount'),
        sql `COUNT(CASE WHEN opponent_count = 5 AND won = FALSE THEN 1 END)`.as('vsFiveLostCount'),
    ])
        .orderBy('clutcher_steam_id')
        .groupBy(['clutches.clutcher_steam_id']);
    if (steamIds.length > 0) {
        query = query.where('clutches.clutcher_steam_id', 'in', steamIds);
    }
    if (checksums.length > 0) {
        query = query.where('clutches.match_checksum', 'in', checksums);
    }
    const rows = await query.execute();
    return rows;
}
//# sourceMappingURL=fetch-players-clutch-stats.js.map