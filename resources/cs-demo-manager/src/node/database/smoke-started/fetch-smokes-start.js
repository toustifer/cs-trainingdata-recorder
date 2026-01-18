import { db } from 'csdm/node/database/database';
import { smokeStartRowToSmokeStart } from './smoke-start-row-to-smoke-start';
export async function fetchSmokesStart(checksum, roundNumber) {
    const rows = await db
        .selectFrom('smokes_start')
        .selectAll()
        .where('match_checksum', '=', checksum)
        .where('round_number', '=', roundNumber)
        .execute();
    const smokesStart = rows.map(smokeStartRowToSmokeStart);
    return smokesStart;
}
//# sourceMappingURL=fetch-smokes-start.js.map