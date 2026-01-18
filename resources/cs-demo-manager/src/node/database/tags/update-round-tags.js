import { db } from 'csdm/node/database/database';
import { uniqueArray } from 'csdm/common/array/unique-array';
export async function updateRoundTags(checksum, roundNumber, tagIds) {
    const uniqueTagIds = uniqueArray(tagIds);
    if (uniqueTagIds.length === 0) {
        return;
    }
    await db.transaction().execute(async (transaction) => {
        await transaction
            .deleteFrom('round_tags')
            .where('checksum', '=', checksum)
            .where('round_number', '=', roundNumber)
            .where('tag_id', 'not in', uniqueTagIds)
            .execute();
        const rows = uniqueTagIds.map((tagId) => {
            return {
                checksum,
                round_number: roundNumber,
                tag_id: tagId,
            };
        });
        await transaction
            .insertInto('round_tags')
            .values(rows)
            .onConflict((oc) => {
            return oc.columns(['checksum', 'round_number', 'tag_id']).doNothing();
        })
            .execute();
    });
}
//# sourceMappingURL=update-round-tags.js.map