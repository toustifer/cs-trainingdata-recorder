import { db } from 'csdm/node/database/database';
export async function fetchMatchChecksums() {
    const rows = await db.selectFrom('matches').select('checksum').execute();
    return rows.map((row) => row.checksum);
}
//# sourceMappingURL=fetch-match-checksums.js.map