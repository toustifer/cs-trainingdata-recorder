import { sql } from 'kysely';
import { TeamLetter } from 'csdm/common/types/counter-strike';
import { db } from '../database';
import { applyMatchFilters } from '../match/apply-match-filters';
export async function fetchTeamMatchSideStats(filters) {
    let query = db
        .selectFrom('teams')
        .leftJoin('matches', 'matches.checksum', 'teams.match_checksum')
        .select((eb) => [
        eb.fn.count('matches.checksum').as('matchCount'),
        sql `COUNT(CASE WHEN teams.letter = ${TeamLetter.A} THEN 1 END)`.as('matchCountStartedAsCt'),
        sql `COUNT(CASE WHEN teams.letter = ${TeamLetter.A} AND matches.winner_name = teams.name THEN 1 END)`.as('matchWonCountStartedAsCt'),
        sql `COUNT(CASE WHEN teams.letter = ${TeamLetter.A} AND matches.winner_name IS NULL THEN 1 END)`.as('matchTieCountStartedAsCt'),
        sql `COUNT(CASE WHEN teams.letter = ${TeamLetter.B} THEN 1 END)`.as('matchCountStartedAsT'),
        sql `COUNT(CASE WHEN teams.letter = ${TeamLetter.B} AND matches.winner_name = teams.name THEN 1 END)`.as('matchWonCountStartedAsT'),
        sql `COUNT(CASE WHEN teams.letter = ${TeamLetter.B} AND matches.winner_name IS NULL THEN 1 END)`.as('matchTieCountStartedAsT'),
    ])
        .where('teams.name', '=', filters.name);
    if (filters) {
        query = applyMatchFilters(query, filters);
    }
    const row = await query.executeTakeFirstOrThrow();
    return row;
}
//# sourceMappingURL=fetch-team-match-side-stats.js.map