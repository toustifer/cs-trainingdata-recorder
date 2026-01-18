import { db } from 'csdm/node/database/database';
export async function fetchChecksumTags() {
    const rows = await db.selectFrom('checksum_tags').selectAll().execute();
    return rows;
}
//# sourceMappingURL=fetch-checksum-tags.js.map