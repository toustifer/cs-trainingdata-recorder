import { db } from 'csdm/node/database/database';
import { damageRowToDamage } from './damage-row-to-damage';
export async function fetchDamages(checksum) {
    const rows = await db.selectFrom('damages').selectAll().where('match_checksum', '=', checksum).execute();
    const damages = rows.map(damageRowToDamage);
    return damages;
}
//# sourceMappingURL=fetch-damages.js.map