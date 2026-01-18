import { sql } from 'kysely';
import { db } from '../database';
export async function updateTimestamp(timestampName) {
    await db
        .insertInto('timestamps')
        .values({ name: timestampName, date: sql `now()` })
        .onConflict((oc) => {
        return oc.column('name').doUpdateSet({
            date: (b) => b.ref('excluded.date'),
        });
    })
        .execute();
}
//# sourceMappingURL=update-timestamp.js.map