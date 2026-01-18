import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useMatchesTable } from './use-matches-table';
export function MatchCount() {
    const table = useMatchesTable();
    const matchCount = table.getRowCount();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: matchCount, one: "# match", other: "# matches" })));
}
//# sourceMappingURL=match-count.js.map