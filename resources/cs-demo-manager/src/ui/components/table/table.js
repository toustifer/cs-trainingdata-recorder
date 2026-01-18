import React from 'react';
import clsx from 'clsx';
import { ArrowDownLongIcon } from 'csdm/ui/icons/arrow-down-long-icon';
import { ArrowUpLongIcon } from 'csdm/ui/icons/arrow-up-long-icon';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
export function Table({ table }) {
    const rows = table.getRows();
    const orderedColumns = table.getOrderedColumns();
    const virtualItems = table.getVirtualItems();
    const totalSize = table.getTotalSize();
    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom = virtualItems.length > 0 ? totalSize - lastArrayItem(virtualItems).end : 0;
    const tableStyle = {
        '--virtualPaddingTop': `${paddingTop}px`,
        '--virtualPaddingBottom': `${paddingBottom}px`,
    };
    return (React.createElement("div", { className: "h-full overflow-auto will-change-scroll", ...table.getWrapperProps() },
        React.createElement("table", { className: "w-fit table-fixed border-collapse border-spacing-0 outline-hidden", style: tableStyle, tabIndex: 0, role: "presentation", "aria-rowcount": rows.length, ...table.getTableProps() },
            React.createElement("thead", null,
                React.createElement("tr", null, orderedColumns.map((column, index) => {
                    if (!table.isColumnVisible(column.id)) {
                        return null;
                    }
                    const dragEnabled = column.allowMove !== false;
                    const sortEnabled = column.allowSort !== false;
                    const style = {
                        width: table.getColumnWidth(column.id),
                    };
                    const renderSortIndicator = () => {
                        const sortDirection = table.getColumnSortDirection(column.id);
                        if (!sortEnabled || sortDirection === undefined) {
                            return null;
                        }
                        return (React.createElement("div", { className: column.allowResize ? 'px-4' : '' }, sortDirection === 'desc' ? React.createElement(ArrowDownLongIcon, { height: 16 }) : React.createElement(ArrowUpLongIcon, { height: 16 })));
                    };
                    const { resizerProps, hasDragOver, sortProps, dragProps, ...columnProps } = table.getColumnProps(column, index);
                    return (React.createElement("th", { key: column.id, className: clsx('sticky top-0 z-1 h-32 bg-gray-50 p-0 outline-hidden', sortEnabled ? 'cursor-pointer' : 'cursor-default', dragEnabled ? 'drag-element' : 'drag-none'), id: column.id, style: style, title: column.headerTooltip, ...(dragEnabled && dragProps), ...(sortEnabled && sortProps), ...columnProps },
                        React.createElement("div", { className: clsx('flex h-full items-center justify-between border-y border-r border-gray-300 px-8 last:border-r-0', hasDragOver ? 'border-l-2 border-l-blue-700' : 'border-l-transparent') },
                            React.createElement("span", { className: clsx('flex-1 truncate text-body-strong', column.textAlign === 'right' ? 'text-right' : 'text-left') }, column.headerText),
                            renderSortIndicator(),
                            column.allowResize !== false && (React.createElement("div", { className: "absolute top-0 right-0 h-full w-8 cursor-col-resize border-r-2 border-r-gray-500", ...resizerProps })))));
                }))),
            React.createElement("tbody", { className: "before:block before:pt-[var(--virtualPaddingTop)] before:content-[''] after:block after:pb-[var(--virtualPaddingBottom)] after:content-['']" }, table.getVirtualItems().map((item, index) => {
                const row = rows[item.index];
                const rowIndex = item.index;
                const rowId = table.getRowId(row);
                const isSelected = table.isRowSelected(rowId);
                const rowProps = table.getRowProps(rowId, row, rowIndex);
                const isSelectionEnabled = table.isSelectionEnabled();
                return (React.createElement("tr", { className: clsx('h-[var(--table-row-height)] outline-hidden', isSelected ? 'bg-gray-300!' : isSelectionEnabled && 'bg-gray-50 hover:bg-gray-200!'), key: rowId, role: "row", tabIndex: index, "aria-rowindex": index + 1, ...rowProps }, orderedColumns.map((column) => {
                    if (!table.isColumnVisible(column.id)) {
                        return null;
                    }
                    const { accessor, formatter, Cell } = column;
                    const value = typeof accessor === 'string' ? row[accessor] : accessor(row);
                    const formattedValue = typeof formatter === 'function' ? formatter(value) : value;
                    return (React.createElement("td", { key: column.id, className: clsx('max-w-0 selectable truncate overflow-hidden border-r border-b border-gray-300 last:border-r-0', column.textAlign === 'right' ? 'text-right' : 'text-left', column.noPadding ? 'p-0' : 'px-4'), title: column.showTooltip ? String(formattedValue) : undefined }, Cell ? React.createElement(Cell, { data: row, rowIndex: index, noPadding: column.noPadding }) : formattedValue));
                })));
            })))));
}
//# sourceMappingURL=table.js.map