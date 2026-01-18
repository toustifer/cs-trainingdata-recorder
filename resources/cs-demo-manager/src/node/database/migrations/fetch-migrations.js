import { sql } from 'kysely';
import { db } from '../database';
export async function fetchMigrations(limit) {
    const migrations = await db
        .selectFrom('migrations')
        .select(['schema_version as version', sql `to_char(run_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`.as('date')])
        .orderBy('run_at', 'desc')
        .limit(limit)
        .execute();
    return migrations;
}
//# sourceMappingURL=fetch-migrations.js.map