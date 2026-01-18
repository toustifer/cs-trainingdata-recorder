import { db } from 'csdm/node/database/database';
import { chickenDeathRowToChickenDeath } from './chicken-death-row-to-chicken-death';
export async function fetchChickenDeaths(checksum) {
    const rows = await db.selectFrom('chicken_deaths').selectAll().where('match_checksum', '=', checksum).execute();
    const chickenDeaths = rows.map((row) => {
        return chickenDeathRowToChickenDeath(row);
    });
    return chickenDeaths;
}
//# sourceMappingURL=fetch-chicken-deaths.js.map