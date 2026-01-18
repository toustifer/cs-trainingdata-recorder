import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
export async function fetchWeaponsRows(checksums) {
    const { count, sum } = db.fn;
    const rows = await db
        .with('s', (db) => {
        return db
            .selectFrom('shots')
            .select(['weapon_name', count('shots.id').as('shot_count')])
            .where('match_checksum', 'in', checksums)
            .groupBy('weapon_name');
    })
        .with('d', (db) => {
        return db
            .selectFrom('damages')
            .select([
            'weapon_name',
            count('damages.id').as('hit_count'),
            sum('damages.health_damage').as('health_damage'),
            sum('damages.armor_damage').as('armor_damage'),
        ])
            .where('match_checksum', 'in', checksums)
            .groupBy('weapon_name');
    })
        .with('k', (db) => {
        return db
            .selectFrom('kills')
            .select(['weapon_name', count('kills.id').as('kill_count')])
            .where('match_checksum', 'in', checksums)
            .groupBy('weapon_name');
    })
        .selectFrom('s')
        .select([
        's.weapon_name as weaponName',
        sql `COALESCE(s.shot_count, 0)`.as('shotCount'),
        sql `COALESCE(d.hit_count, 0)`.as('hitCount'),
        sql `COALESCE(d.health_damage, 0)`.as('healthDamage'),
        sql `COALESCE(d.armor_damage, 0)`.as('armorDamage'),
        sql `COALESCE(k.kill_count, 0)`.as('killCount'),
    ])
        .leftJoin('d', 's.weapon_name', 'd.weapon_name')
        .leftJoin('k', 's.weapon_name', 'k.weapon_name')
        .execute();
    return rows;
}
//# sourceMappingURL=fetch-weapons-rows.js.map