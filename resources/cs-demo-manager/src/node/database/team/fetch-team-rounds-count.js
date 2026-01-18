import { sql } from 'kysely';
import { TeamNumber } from 'csdm/common/types/counter-strike';
import { db } from '../database';
import { applyMatchFilters } from '../match/apply-match-filters';
export async function fetchTeamRoundCount({ name, ...filters }) {
    const { count } = db.fn;
    let query = db
        .selectFrom('rounds')
        .select([
        count('rounds.id').as('totalCount'),
        sql `COUNT(rounds.id) FILTER (
        WHERE rounds.team_a_name = teams.name
        AND rounds.team_a_side = ${TeamNumber.CT}
        OR (
          rounds.team_b_name = teams.name
          AND rounds.team_b_side = ${TeamNumber.CT}
          )
        )`.as('roundCountAsCt'),
        sql `COUNT(rounds.id) FILTER (
          WHERE rounds.team_a_name = teams.name
          AND rounds.team_a_side = ${TeamNumber.T}
          OR (
            rounds.team_b_name = teams.name
            AND rounds.team_b_side = ${TeamNumber.T}
            )
          )`.as('roundCountAsT'),
    ])
        .leftJoin('matches', 'matches.checksum', 'rounds.match_checksum')
        .leftJoin('teams', 'teams.match_checksum', 'rounds.match_checksum')
        .where((eb) => {
        return eb('teams.name', '=', name).or('teams.name', '=', name);
    });
    query = applyMatchFilters(query, filters);
    const row = await query.executeTakeFirst();
    if (!row) {
        return {
            totalCount: 0,
            roundCountAsCt: 0,
            roundCountAsT: 0,
        };
    }
    return row;
}
//# sourceMappingURL=fetch-team-rounds-count.js.map