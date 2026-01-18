import { sql } from 'kysely';
const createDownloadHistoryTable = {
    schemaVersion: 1,
    run: async (transaction) => {
        await transaction.schema
            .createTable('download_history')
            .ifNotExists()
            .addColumn('match_id', 'varchar', (col) => col.primaryKey())
            .addColumn('downloaded_at', 'timestamp', (col) => col.notNull().defaultTo(sql `now()`))
            .execute();
    },
};
// eslint-disable-next-line no-restricted-syntax
export default createDownloadHistoryTable;
//# sourceMappingURL=create-downloads-history-table.js.map