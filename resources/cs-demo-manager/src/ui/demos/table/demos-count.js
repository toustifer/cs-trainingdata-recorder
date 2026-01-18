import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useDemosTable } from './use-demos-table';
export function DemosCount() {
    const table = useDemosTable();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: table.getRowCount(), one: "# demo", other: "# demos" })));
}
//# sourceMappingURL=demos-count.js.map