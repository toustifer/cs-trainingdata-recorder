import { db } from 'csdm/node/database/database';
export async function isTimestampExpired(timestampName, expirationTimeInMilliseconds) {
    const timestamp = await db.selectFrom('timestamps').selectAll().where('name', '=', timestampName).executeTakeFirst();
    if (!timestamp) {
        return true;
    }
    const oneDayInMilliseconds = 3600 * 24 * 1000;
    const expirationTime = expirationTimeInMilliseconds ?? oneDayInMilliseconds;
    return Date.now() - timestamp.date.getTime() >= expirationTime;
}
//# sourceMappingURL=is-timestamp-expired.js.map