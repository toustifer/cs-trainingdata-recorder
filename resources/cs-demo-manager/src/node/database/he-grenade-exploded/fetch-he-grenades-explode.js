import { db } from 'csdm/node/database/database';
import { heGrenadeExplodeRowToHeGrenadeExplode } from './he-grenade-explode-row-to-he-grenade-explode';
export async function fetchHeGrenadesExplode(checksum, roundNumber) {
    const rows = await db
        .selectFrom('he_grenades_explode')
        .selectAll()
        .where('match_checksum', '=', checksum)
        .where('round_number', '=', roundNumber)
        .execute();
    const heGrenadesExplode = rows.map(heGrenadeExplodeRowToHeGrenadeExplode);
    return heGrenadesExplode;
}
//# sourceMappingURL=fetch-he-grenades-explode.js.map