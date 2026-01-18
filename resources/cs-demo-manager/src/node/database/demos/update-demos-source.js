import { db } from 'csdm/node/database/database';
export async function updateDemosSource(checksums, source) {
    await db
        .updateTable('demos')
        .set({
        source,
    })
        .where('checksum', 'in', checksums)
        .execute();
}
//# sourceMappingURL=update-demos-source.js.map