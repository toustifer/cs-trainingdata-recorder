import { db } from 'csdm/node/database/database';
export async function insertOrUpdateRoundComment(checksum, number, comment) {
    await db
        .insertInto('round_comments')
        .values({
        match_checksum: checksum,
        number,
        comment,
    })
        .onConflict((oc) => {
        return oc.columns(['match_checksum', 'number']).doUpdateSet({
            comment: (b) => b.ref('excluded.comment'),
        });
    })
        .execute();
}
//# sourceMappingURL=insert-or-update-round-comment.js.map