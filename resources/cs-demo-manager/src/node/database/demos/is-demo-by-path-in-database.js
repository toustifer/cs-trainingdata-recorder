import { db } from 'csdm/node/database/database';
export async function isDemoByPathInDatabase(filePath) {
    const row = await db.selectFrom('matches').select('checksum').where('demo_path', '=', filePath).executeTakeFirst();
    return row !== undefined;
}
//# sourceMappingURL=is-demo-by-path-in-database.js.map