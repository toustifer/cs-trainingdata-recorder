import { db } from 'csdm/node/database/database';
export async function deleteTag(tagId) {
    await db.deleteFrom('tags').where('id', '=', tagId).execute();
}
//# sourceMappingURL=delete-tag.js.map