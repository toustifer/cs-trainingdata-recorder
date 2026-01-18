import { sql } from 'kysely';
import { getSettings } from '../settings/get-settings';
import { db } from './database';
export async function getDatabaseSize() {
    const settings = await getSettings();
    const { database } = settings;
    const query = sql `select pg_size_pretty(pg_database_size(${database.database})) as size`;
    const { rows } = await query.execute(db);
    return rows.length > 0 ? rows[0].size : '0 MB';
}
//# sourceMappingURL=get-database-size.js.map