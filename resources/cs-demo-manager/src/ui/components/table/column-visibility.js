import React from 'react';
import clsx from 'clsx';
export function ColumnVisibility({ table, columnId, label, tables = [] }) {
    const isVisible = table.isColumnVisible(columnId);
    const onClick = () => {
        const allTables = [table, ...tables];
        for (const table of allTables) {
            if (isVisible) {
                table.hideColumn(columnId);
            }
            else {
                table.showColumn(columnId);
            }
        }
    };
    return (React.createElement("button", { className: clsx('flex cursor-default items-center justify-center rounded border px-8 py-4 text-caption select-none hover:text-gray-900', isVisible
            ? 'border-gray-400 bg-gray-50 text-gray-900 hover:bg-gray-100'
            : 'border-transparent bg-gray-200 text-gray-600'), onClick: onClick }, label));
}
//# sourceMappingURL=column-visibility.js.map