const createFaceitAccountsTable = {
    schemaVersion: 1,
    run: async (transaction) => {
        await transaction.schema
            .createTable('faceit_accounts')
            .ifNotExists()
            .addColumn('id', 'varchar', (col) => col.notNull().unique().primaryKey())
            .addColumn('nickname', 'varchar', (col) => col.notNull())
            .addColumn('avatar_url', 'varchar', (col) => col.notNull())
            .addColumn('is_current', 'boolean', (col) => col.notNull())
            .execute();
    },
};
// eslint-disable-next-line no-restricted-syntax
export default createFaceitAccountsTable;
//# sourceMappingURL=create-faceit-accounts-table.js.map