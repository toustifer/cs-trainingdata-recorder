import { db } from 'csdm/node/database/database';
export async function fetchComments() {
    const rows = await db.selectFrom('comments').selectAll().execute();
    return rows;
}
//# sourceMappingURL=fetch-comments.js.map