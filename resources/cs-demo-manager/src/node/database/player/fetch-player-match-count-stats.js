import { db } from 'csdm/node/database/database';
import { applyMatchFilters } from '../match/apply-match-filters';
function buildQuery(steamId, filters) {
    const { count } = db.fn;
    let query = db
        .selectFrom('matches')
        .select(count('matches.checksum').as('matchCount'))
        .leftJoin('players', 'players.match_checksum', 'matches.checksum')
        .where('players.steam_id', '=', steamId);
    if (filters) {
        query = applyMatchFilters(query, filters);
    }
    return query;
}
export async function fetchPlayerMatchCountStats(steamId, filters) {
    const wonMatchQuery = buildQuery(steamId, filters).whereRef('matches.winner_name', '=', 'players.team_name');
    const lostMatchQuery = buildQuery(steamId, filters)
        .where('matches.winner_name', 'is not', null)
        .whereRef('matches.winner_name', '!=', 'players.team_name');
    const tiedMatchQuery = buildQuery(steamId, filters).where('matches.winner_name', 'is', null);
    const [wonMatchResult, lostMatchResult, tiedMatchResult] = await Promise.all([
        wonMatchQuery.executeTakeFirst(),
        lostMatchQuery.executeTakeFirst(),
        tiedMatchQuery.executeTakeFirst(),
    ]);
    return {
        wonMatchCount: wonMatchResult?.matchCount ?? 0,
        lostMatchCount: lostMatchResult?.matchCount ?? 0,
        tiedMatchCount: tiedMatchResult?.matchCount ?? 0,
    };
}
//# sourceMappingURL=fetch-player-match-count-stats.js.map