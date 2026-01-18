import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useDemosTable } from './use-demos-table';
export function SelectedDemoCount() {
    const table = useDemosTable();
    const selectedDemoCount = table.getSelectedRowCount();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: selectedDemoCount, one: "# demo selected", other: "# demos selected" })));
}
//# sourceMappingURL=selected-demo-count.js.map