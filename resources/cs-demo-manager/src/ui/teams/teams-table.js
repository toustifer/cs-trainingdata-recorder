import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
import { Table } from 'csdm/ui/components/table/table';
import { Status } from 'csdm/common/types/status';
import { useTeamsStatus } from './use-teams-status';
import { NoTeams } from './no-teams';
import { TeamsTableStatusBar } from './table/teams-table-status-bar';
import { useTeamsTable } from './table/use-teams-table';
export function TeamsTable() {
    const status = useTeamsStatus();
    const table = useTeamsTable();
    if (status === Status.Loading || !table.isReady()) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading teams\u2026") });
    }
    if (status === Status.Error) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
    }
    if (table.getRowCount() === 0) {
        return React.createElement(NoTeams, null);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Table, { table: table }),
        React.createElement(TeamsTableStatusBar, null)));
}
//# sourceMappingURL=teams-table.js.map