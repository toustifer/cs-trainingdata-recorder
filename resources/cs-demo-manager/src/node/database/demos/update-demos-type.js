import { db } from '../database';
export async function updateDemosType(checksums, type) {
    await db
        .updateTable('demos')
        .set({
        type,
    })
        .where('checksum', 'in', checksums)
        .execute();
}
//# sourceMappingURL=update-demos-type.js.map