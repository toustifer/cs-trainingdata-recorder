import { db } from 'csdm/node/database/database';
import { bombDefusedRowToBombDefused } from './bomb-defused-row-to-bomb-defused';
export async function fetchBombsDefused(checksum) {
    const rows = await db.selectFrom('bombs_defused').selectAll().where('match_checksum', '=', checksum).execute();
    const bombsDefused = rows.map(bombDefusedRowToBombDefused);
    return bombsDefused;
}
//# sourceMappingURL=fetch-bombs-defused.js.map