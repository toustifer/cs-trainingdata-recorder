import React from 'react';
import { Plural } from '@lingui/react/macro';
import { usePlayersTable } from './use-players-table';
export function SelectedPlayerCount() {
    const table = usePlayersTable();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: table.getSelectedRowCount(), one: "# player selected", other: "# players selected" })));
}
//# sourceMappingURL=selected-player-count.js.map