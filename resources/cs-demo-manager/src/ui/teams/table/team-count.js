import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useTeamsTable } from './use-teams-table';
export function TeamCount() {
    const table = useTeamsTable();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: table.getRowCount(), one: "# team", other: "# teams" })));
}
//# sourceMappingURL=team-count.js.map