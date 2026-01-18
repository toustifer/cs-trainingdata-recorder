import { sql } from 'kysely';
import { EconomyType } from 'csdm/common/types/counter-strike';
import { db } from 'csdm/node/database/database';
import { applyMatchFilters } from '../match/apply-match-filters';
export async function fetchPlayersEconomyStats(steamIds, filters) {
    const { avg } = db.fn;
    let query = db
        .selectFrom('player_economies')
        .select([
        'player_steam_id as steamId',
        avg('money_spent').as('averageMoneySpentPerRound'),
        sql `COUNT(CASE WHEN player_economies.type = ${EconomyType.Eco} THEN 1 END)`.as('ecoCount'),
        sql `COUNT(CASE WHEN player_economies.type = ${EconomyType.Semi} THEN 1 END)`.as('semiEcoCount'),
        sql `COUNT(CASE WHEN player_economies.type = ${EconomyType.ForceBuy} THEN 1 END)`.as('forceBuyCount'),
        sql `COUNT(CASE WHEN player_economies.type = ${EconomyType.Full} THEN 1 END)`.as('fullBuyCount'),
    ])
        .leftJoin('matches', 'matches.checksum', 'player_economies.match_checksum')
        .where('player_steam_id', 'in', steamIds)
        .orderBy('player_steam_id')
        .groupBy(['player_steam_id']);
    if (filters) {
        query = applyMatchFilters(query, filters);
    }
    const rows = await query.execute();
    return rows;
}
//# sourceMappingURL=fetch-players-economy-stats.js.map