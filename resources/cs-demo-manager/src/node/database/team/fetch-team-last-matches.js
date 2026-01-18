import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { TeamLetter } from 'csdm/common/types/counter-strike';
export async function fetchTeamLastMatches(teamName) {
    const matches = await db
        .selectFrom('matches')
        .select([
        sql `${teamName}`.as('focusTeamName'),
        'matches.checksum',
        'matches.game',
        'map_name as mapName',
        'winner_name as winnerName',
        sql `to_char(matches.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`.as('date'),
    ])
        .innerJoin('teams as teamA', function (qb) {
        return qb.on('teamA.letter', '=', TeamLetter.A).onRef('teamA.match_checksum', '=', 'matches.checksum');
    })
        .select(['teamA.score as scoreTeamA'])
        .innerJoin('teams as teamB', function (qb) {
        return qb.on('teamB.letter', '=', TeamLetter.B).onRef('teamB.match_checksum', '=', 'matches.checksum');
    })
        .select(['teamB.score as scoreTeamB'])
        .where((eb) => {
        return eb('teamA.name', '=', teamName).or('teamB.name', '=', teamName);
    })
        .orderBy('date', 'desc')
        .limit(8)
        .execute();
    return matches;
}
//# sourceMappingURL=fetch-team-last-matches.js.map