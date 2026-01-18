import { WeaponType } from 'csdm/common/types/counter-strike';
import { db } from 'csdm/node/database/database';
export async function fetchCollateralKillCountPerMatch(checksums) {
    const { count } = db.fn;
    const subQuery = db.with('collateral_kills', (db) => {
        let query = db
            .selectFrom('kills')
            .select(['match_checksum as checksum', count('tick').as('tick')])
            .where('weapon_type', 'not in', [WeaponType.Equipment, WeaponType.Grenade, WeaponType.Unknown, WeaponType.World])
            .groupBy(['tick', 'killer_steam_id', 'match_checksum'])
            .having(count('tick'), '>', 1);
        if (Array.isArray(checksums) && checksums.length > 0) {
            query = query.where('match_checksum', 'in', checksums);
        }
        return query;
    });
    const rows = await subQuery
        .selectFrom('collateral_kills')
        .select(['checksum', count('checksum').as('collateralKillCount')])
        .groupBy(['tick', 'checksum'])
        .execute();
    const collateralKillCountPerMatch = {};
    for (const row of rows) {
        collateralKillCountPerMatch[row.checksum] = row.collateralKillCount;
    }
    return collateralKillCountPerMatch;
}
//# sourceMappingURL=fetch-collateral-kill-count-per-match.js.map