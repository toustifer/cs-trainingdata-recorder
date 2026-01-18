export async function ensureMigrationsTableExists(transaction) {
    await transaction.schema
        .createTable('migrations')
        .ifNotExists()
        .addColumn('schema_version', 'integer', (col) => col.notNull().unique())
        .addColumn('run_at', 'timestamptz', (col) => col.notNull())
        .execute();
}
//# sourceMappingURL=ensure-migrations-table-exists.js.map