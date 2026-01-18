import React from 'react';
import { Plural } from '@lingui/react/macro';
import { usePlayersTable } from './use-players-table';
export function PlayerCount() {
    const table = usePlayersTable();
    return (React.createElement("p", { className: "selectable" },
        React.createElement(Plural, { value: table.getRowCount(), one: "# player", other: "# players" })));
}
//# sourceMappingURL=player-count.js.map