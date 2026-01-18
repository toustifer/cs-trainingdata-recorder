import { db } from 'csdm/node/database/database';
import { bombDefuseStartRowToBombDefuseStart } from './bomb-defuse-start-row-to-bomb-defuse-start';
export async function fetchBombsDefuseStart(checksum, roundNumber) {
    const rows = await db
        .selectFrom('bombs_defuse_start')
        .selectAll()
        .where('match_checksum', '=', checksum)
        .where('round_number', '=', roundNumber)
        .execute();
    const bombsDefuseStart = rows.map((row) => {
        return bombDefuseStartRowToBombDefuseStart(row);
    });
    return bombsDefuseStart;
}
//# sourceMappingURL=fetch-bombs-defuse-start.js.map