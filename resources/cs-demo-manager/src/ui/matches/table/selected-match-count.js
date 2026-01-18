import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useMatchesTable } from './use-matches-table';
export function SelectedMatchCount() {
    const table = useMatchesTable();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: table.getSelectedRowCount(), one: "# match selected", other: "# matches selected" })));
}
//# sourceMappingURL=selected-match-count.js.map