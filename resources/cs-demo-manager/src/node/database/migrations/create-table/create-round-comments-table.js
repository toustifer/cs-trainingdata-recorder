export async function createRoundCommentsTable(transaction) {
    await transaction.schema
        .createTable('round_comments')
        .ifNotExists()
        .addColumn('match_checksum', 'varchar', (col) => col.notNull())
        .addColumn('number', 'integer', (col) => col.notNull())
        .addColumn('comment', 'text', (col) => col.notNull().defaultTo(''))
        .addPrimaryKeyConstraint('round_comments_pkey', ['match_checksum', 'number'])
        .execute();
}
//# sourceMappingURL=create-round-comments-table.js.map