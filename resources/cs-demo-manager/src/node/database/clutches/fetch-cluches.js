import { db } from 'csdm/node/database/database';
import { clutchRowToClutch } from './clutch-row-to-clutch';
export async function fetchClutches(checksum) {
    const clutchRows = await db.selectFrom('clutches').selectAll().where('match_checksum', '=', checksum).execute();
    const clutches = clutchRows.map((row) => {
        return clutchRowToClutch(row);
    });
    return clutches;
}
//# sourceMappingURL=fetch-cluches.js.map