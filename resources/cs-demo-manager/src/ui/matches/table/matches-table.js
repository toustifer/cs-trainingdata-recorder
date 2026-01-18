import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
import { Status } from 'csdm/common/types/status';
import { useMatchesStatus } from '../use-matches-status';
import { Table } from 'csdm/ui/components/table/table';
import { useMatchesTable } from './use-matches-table';
import { NoMatches } from './no-matches';
export function MatchesTable() {
    const table = useMatchesTable();
    const status = useMatchesStatus();
    const isLoading = status === Status.Idle || status === Status.Loading || !table.isReady();
    if (isLoading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading matches\u2026") });
    }
    if (status === Status.Error) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
    }
    if (table.getRowCount() === 0) {
        return React.createElement(NoMatches, null);
    }
    return React.createElement(Table, { table: table });
}
//# sourceMappingURL=matches-table.js.map