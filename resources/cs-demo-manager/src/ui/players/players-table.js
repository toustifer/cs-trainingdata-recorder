import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
import { Table } from 'csdm/ui/components/table/table';
import { Status } from 'csdm/common/types/status';
import { usePlayersStatus } from './use-players-status';
import { NoPlayers } from './no-players';
import { PlayersTableStatusBar } from './table/players-table-status-bar';
import { usePlayersTable } from './table/use-players-table';
export function PlayersTable() {
    const status = usePlayersStatus();
    const table = usePlayersTable();
    if (status === Status.Loading || !table.isReady()) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading players\u2026") });
    }
    if (status === Status.Error) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
    }
    if (table.getRowCount() === 0) {
        return React.createElement(NoPlayers, null);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Table, { table: table }),
        React.createElement(PlayersTableStatusBar, null)));
}
//# sourceMappingURL=players-table.js.map