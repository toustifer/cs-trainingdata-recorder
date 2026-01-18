export async function tableHasColumn(transaction, tableName, columnName) {
    const tables = await transaction.introspection.getTables();
    const table = tables.find((table) => table.name === tableName);
    if (!table) {
        throw new Error(`Table ${tableName} not found`);
    }
    return table.columns.some((column) => column.name === columnName);
}
//# sourceMappingURL=introspection.js.map