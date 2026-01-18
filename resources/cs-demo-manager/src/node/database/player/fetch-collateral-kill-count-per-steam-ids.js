import { WeaponType } from 'csdm/common/types/counter-strike';
import { db } from '../database';
export async function fetchCollateralKillCountPerSteamId(checksum) {
    const { count } = db.fn;
    const subQuery = db.with('collateral_kills', (db) => {
        return db
            .selectFrom('kills')
            .select(['killer_steam_id', count('tick').as('tick')])
            .where('match_checksum', '=', checksum)
            .where('weapon_type', 'not in', [WeaponType.Equipment, WeaponType.Grenade, WeaponType.Unknown, WeaponType.World])
            .groupBy(['tick', 'killer_steam_id'])
            .having(count('tick'), '>', 1)
            .$assertType();
    });
    const rows = await subQuery
        .selectFrom('collateral_kills')
        .select(['killer_steam_id as steamId', count('killer_steam_id').as('collateralKillCount')])
        .groupBy('killer_steam_id')
        .execute();
    const collateralKillCountPerSteamId = {};
    for (const row of rows) {
        collateralKillCountPerSteamId[row.steamId] = row.collateralKillCount;
    }
    return collateralKillCountPerSteamId;
}
//# sourceMappingURL=fetch-collateral-kill-count-per-steam-ids.js.map