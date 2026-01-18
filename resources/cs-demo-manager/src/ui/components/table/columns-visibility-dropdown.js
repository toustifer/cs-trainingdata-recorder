import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ColumnVisibility } from 'csdm/ui/components/table/column-visibility';
import { Dropdown } from 'csdm/ui/components/dropdown';
export function ColumnsVisibilityDropdown({ isDisabled, table, tables }) {
    const sortedColumns = table.getHideableColumns().sort((colA, colB) => {
        const textA = colA.visibilityText ?? colA.headerText;
        const textB = colB.visibilityText ?? colB.headerText;
        return textA.localeCompare(textB);
    });
    return (React.createElement(Dropdown, { togglerContent: React.createElement(Trans, { context: "Dropdown" }, "Columns"), isDisabled: isDisabled },
        React.createElement("div", { className: "flex w-[424px] flex-wrap gap-8 p-8" }, sortedColumns.map((column) => {
            return (React.createElement(ColumnVisibility, { key: column.id, columnId: column.id, label: column.visibilityText ?? column.headerText, table: table, tables: tables }));
        }))));
}
//# sourceMappingURL=columns-visibility-dropdown.js.map