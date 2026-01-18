export function dateSortFunction(sortDirection, column) {
    return (rowA, rowB) => {
        const dateA = (typeof column.accessor === 'string' ? rowA[column.accessor] : column.accessor(rowA));
        const dateB = (typeof column.accessor === 'string' ? rowB[column.accessor] : column.accessor(rowB));
        if (sortDirection === 'asc') {
            return new Date(dateA).getTime() - new Date(dateB).getTime();
        }
        return new Date(dateB).getTime() - new Date(dateA).getTime();
    };
}
//# sourceMappingURL=date-sort-function.js.map