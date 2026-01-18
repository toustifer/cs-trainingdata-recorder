import { db } from 'csdm/node/database/database';
import { bombExplodedRowToBombExploded } from './bomb-exploded-row-to-bomb-exploded';
export async function fetchBombsExploded(checksum) {
    const rows = await db.selectFrom('bombs_exploded').selectAll().where('match_checksum', '=', checksum).execute();
    const bombsExploded = rows.map(bombExplodedRowToBombExploded);
    return bombsExploded;
}
//# sourceMappingURL=fetch-bombs-exploded.js.map