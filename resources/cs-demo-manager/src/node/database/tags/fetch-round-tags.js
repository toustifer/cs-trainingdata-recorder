import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
export async function fetchRoundTags(checksum, roundNumber) {
    let query = db
        .selectFrom('round_tags')
        .select(['checksum', 'round_number', sql `CAST(tag_id AS TEXT)`.as('tag_id')])
        .where('checksum', '=', checksum);
    if (roundNumber) {
        query = query.where('round_number', '=', roundNumber);
    }
    const rows = await query.execute();
    return rows;
}
//# sourceMappingURL=fetch-round-tags.js.map