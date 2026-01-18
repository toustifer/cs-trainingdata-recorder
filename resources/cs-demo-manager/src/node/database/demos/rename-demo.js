import { isEmptyString } from 'csdm/common/string/is-empty-string';
import { db } from 'csdm/node/database/database';
import { InvalidDemoName } from './errors/invalid-demo-name';
export async function renameDemo(checksum, name) {
    if (isEmptyString(name)) {
        throw new InvalidDemoName();
    }
    await db
        .updateTable('demos')
        .set({
        name,
    })
        .where('checksum', '=', checksum)
        .execute();
    await db
        .updateTable('matches')
        .set({
        name,
    })
        .where('checksum', '=', checksum)
        .execute();
}
//# sourceMappingURL=rename-demo.js.map