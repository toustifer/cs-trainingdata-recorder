import React from 'react';
import { Plural } from '@lingui/react/macro';
import { useTeamsTable } from './use-teams-table';
export function SelectedTeamCount() {
    const table = useTeamsTable();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: table.getSelectedRowCount(), one: "# team selected", other: "# teams selected" })));
}
//# sourceMappingURL=selected-team-count.js.map