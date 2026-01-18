import { db } from 'csdm/node/database/database';
import { bombPlantedRowToBombPlanted } from './bomb-planted-row-to-bomb-planted';
export async function fetchBombsPlanted(checksum) {
    const rows = await db.selectFrom('bombs_planted').selectAll().where('match_checksum', '=', checksum).execute();
    const bombsPlanted = rows.map(bombPlantedRowToBombPlanted);
    return bombsPlanted;
}
//# sourceMappingURL=fetch-bombs-planted.js.map