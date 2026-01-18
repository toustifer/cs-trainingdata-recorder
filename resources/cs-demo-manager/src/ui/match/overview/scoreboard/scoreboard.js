import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TeamScore } from 'csdm/ui/components/match/team-score';
import { Table } from 'csdm/ui/components/table/table';
import { Message } from 'csdm/ui/components/message';
export function Scoreboard({ table, teamName, score, scoreOppositeTeam }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(TeamScore, { teamName: teamName, teamScore: score, scoreOppositeTeam: scoreOppositeTeam }),
        table.isReady() ? (React.createElement("div", null,
            React.createElement(Table, { table: table }))) : (React.createElement(Message, { message: React.createElement(Trans, null, "Loading\u2026") }))));
}
//# sourceMappingURL=scoreboard.js.map