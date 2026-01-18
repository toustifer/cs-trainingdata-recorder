import { db } from 'csdm/node/database/database';
import { TeamLetter } from 'csdm/common/types/counter-strike';
import { teamRowToTeam } from '../teams/team-row-to-team';
export async function fetchMatchTeamA(checksum) {
    const teamRow = await db
        .selectFrom('teams')
        .selectAll()
        .where('match_checksum', '=', checksum)
        .where('letter', '=', TeamLetter.A)
        .executeTakeFirst();
    if (teamRow === undefined) {
        throw new Error('Team A not found');
    }
    const teamA = teamRowToTeam(teamRow);
    return teamA;
}
//# sourceMappingURL=fetch-match-team-a.js.map