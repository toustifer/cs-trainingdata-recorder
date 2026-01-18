import { sql } from 'kysely';
const createIgnoredSteamAccountsTable = {
    schemaVersion: 1,
    run: async (transaction) => {
        await transaction.schema
            .createTable('ignored_steam_accounts')
            .ifNotExists()
            .addColumn('steam_id', 'varchar', (col) => col
            .notNull()
            .primaryKey()
            .check(sql `length((steam_id)::text) > 0`))
            .execute();
    },
};
// eslint-disable-next-line no-restricted-syntax
export default createIgnoredSteamAccountsTable;
//# sourceMappingURL=create-ignored-steam-accounts-table.js.map