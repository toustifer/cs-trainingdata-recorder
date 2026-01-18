import React from 'react';
import { TeamScore } from 'csdm/ui/components/match/team-score';
import { useTable } from 'csdm/ui/components/table/use-table';
import { Table } from 'csdm/ui/components/table/table';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { use5EPlayScoreboardColumns } from './use-5eplay-scoreboard-columns';
import { FiveEPlayScoreboardContextMenu } from './5eplay-scoreboard-context-menu';
function getRowId(player) {
    return player.id;
}
export function FiveEPlayScoreboard({ teamName, teamScore, players, scoreOppositeTeam }) {
    const columns = use5EPlayScoreboardColumns();
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event, table) => {
        const players = table.getSelectedRows();
        if (players.length !== 1) {
            return;
        }
        showContextMenu(event, React.createElement(FiveEPlayScoreboardContextMenu, { domainId: players[0].domainId }));
    };
    const table = useTable({
        columns,
        data: players,
        getRowId,
        rowSelection: 'single',
        onContextMenu,
        sortedColumn: { id: 'kill-count', direction: 'desc' },
    });
    return (React.createElement("div", { className: "m-auto flex flex-col" },
        React.createElement(TeamScore, { teamName: teamName, teamScore: teamScore, scoreOppositeTeam: scoreOppositeTeam }),
        React.createElement(Table, { table: table })));
}
//# sourceMappingURL=5eplay-scoreboard.js.map