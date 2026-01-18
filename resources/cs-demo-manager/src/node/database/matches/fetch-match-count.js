import { db } from 'csdm/node/database/database';
export async function fetchMatchCount() {
    const { count } = db.fn;
    const result = await db.selectFrom('matches').select(count('checksum').as('matchCount')).executeTakeFirst();
    return result?.matchCount ?? 0;
}
//# sourceMappingURL=fetch-match-count.js.map