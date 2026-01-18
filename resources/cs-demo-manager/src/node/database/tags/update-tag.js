import { DatabaseError } from 'pg';
import { db } from 'csdm/node/database/database';
import { PostgresqlErrorCode } from '../postgresql-error-code';
import { assertValidTag } from './assert-valid-tag';
import { TagNameAlreadyTaken } from './errors/tag-name-already-taken';
export async function updateTag(tag) {
    assertValidTag(tag);
    try {
        await db.updateTable('tags').set(tag).where('id', '=', tag.id).execute();
    }
    catch (error) {
        if (error instanceof DatabaseError) {
            switch (error.code) {
                case PostgresqlErrorCode.UniqueViolation:
                    throw new TagNameAlreadyTaken();
            }
        }
        throw error;
    }
}
//# sourceMappingURL=update-tag.js.map