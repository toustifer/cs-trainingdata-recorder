import { db } from '../database';
export async function fetchDownloadHistories() {
    const rows = await db.selectFrom('download_history').selectAll().execute();
    return rows;
}
//# sourceMappingURL=fetch-download-histories.js.map