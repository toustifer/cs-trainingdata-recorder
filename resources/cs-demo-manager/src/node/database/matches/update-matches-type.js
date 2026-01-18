import { db } from '../database';
export async function updateMatchesType(checksums, type) {
    await db
        .updateTable('matches')
        .set({
        type,
    })
        .where('checksum', 'in', checksums)
        .execute();
}
//# sourceMappingURL=update-matches-type.js.map