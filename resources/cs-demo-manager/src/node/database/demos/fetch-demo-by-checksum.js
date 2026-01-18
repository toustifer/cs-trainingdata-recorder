import { db } from 'csdm/node/database/database';
import { fetchChecksumTagIds } from '../tags/fetch-checksum-tag-ids';
import { demoRowToDemo } from './demo-row-to-demo';
export async function fetchDemoByChecksum(checksum) {
    const row = await db
        .selectFrom('demos')
        .selectAll()
        .select('demos.checksum as checksum')
        .innerJoin('demo_paths', 'demo_paths.checksum', 'demos.checksum')
        .select('demo_paths.file_path')
        .leftJoin('comments', 'comments.checksum', 'demos.checksum')
        .select('comments.comment')
        .where('demos.checksum', '=', checksum)
        .executeTakeFirst();
    if (row === undefined) {
        return undefined;
    }
    const tagIds = await fetchChecksumTagIds(checksum);
    const demo = demoRowToDemo(row, row.file_path, tagIds, row.comment);
    return demo;
}
//# sourceMappingURL=fetch-demo-by-checksum.js.map