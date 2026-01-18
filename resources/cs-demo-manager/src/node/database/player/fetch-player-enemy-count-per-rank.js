import { DemoSource } from 'csdm/common/types/counter-strike';
import { db } from 'csdm/node/database/database';
import { applyMatchFilters } from '../match/apply-match-filters';
async function fetchMatchChecksumsWithPlayer(steamId, filters) {
    let query = db
        .selectFrom('matches')
        .select(['matches.checksum', 'date'])
        .leftJoin('players', 'players.match_checksum', 'matches.checksum')
        .where('steam_id', '=', steamId);
    query = applyMatchFilters(query, { ...filters, demoSources: [DemoSource.Valve] });
    const rows = await query.execute();
    const checksums = rows.map((row) => row.checksum);
    return checksums;
}
async function fetchPlayerEnemiesRankInMatches(steamId, checksums, filters) {
    let query = db
        .selectFrom('players')
        .select(['rank'])
        .leftJoin('matches', 'matches.checksum', 'players.match_checksum')
        .select('date')
        .where('steam_id', '<>', steamId);
    if (checksums.length > 0) {
        query = query.where('matches.checksum', 'in', checksums);
    }
    query = applyMatchFilters(query, { ...filters, demoSources: [DemoSource.Valve] });
    const enemiesRank = await query.execute();
    return enemiesRank;
}
export async function fetchPlayerEnemyCountPerRank(steamId, filters) {
    const matchChecksumsWithPlayer = await fetchMatchChecksumsWithPlayer(steamId, filters);
    const enemiesRank = await fetchPlayerEnemiesRankInMatches(steamId, matchChecksumsWithPlayer, filters);
    const enemyCountPerRank = {};
    for (const { rank } of enemiesRank) {
        enemyCountPerRank[rank] = enemyCountPerRank[rank] ? enemyCountPerRank[rank] + 1 : 1;
    }
    return enemyCountPerRank;
}
//# sourceMappingURL=fetch-player-enemy-count-per-rank.js.map