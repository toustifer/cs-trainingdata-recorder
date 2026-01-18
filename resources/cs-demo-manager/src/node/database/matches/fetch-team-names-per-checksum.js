import { TeamLetter } from 'csdm/common/types/counter-strike';
import { db } from '../database';
export async function fetchTeamNamesPerChecksum(checksums) {
    const rows = await db
        .selectFrom('teams as ta')
        .innerJoin('teams as tb', 'ta.match_checksum', 'tb.match_checksum')
        .select(['ta.match_checksum as checksum', 'ta.name as teamNameA', 'tb.name as teamNameB'])
        .where('ta.match_checksum', 'in', checksums)
        .where('ta.letter', '=', TeamLetter.A)
        .where('tb.letter', '=', TeamLetter.B)
        .execute();
    const teamNamesPerChecksum = {};
    rows.forEach((row) => {
        teamNamesPerChecksum[row.checksum] = {
            teamNameA: row.teamNameA,
            teamNameB: row.teamNameB,
        };
    });
    return teamNamesPerChecksum;
}
//# sourceMappingURL=fetch-team-names-per-checksum.js.map