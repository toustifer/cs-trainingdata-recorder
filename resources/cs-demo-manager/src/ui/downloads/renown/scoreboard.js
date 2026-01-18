import React from 'react';
import { TeamScore } from 'csdm/ui/components/match/team-score';
import { useTable } from 'csdm/ui/components/table/use-table';
import { Table } from 'csdm/ui/components/table/table';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { RenownScoreboardContextMenu } from './renown-scoreboard-context-menu';
import { useRenownScoreboardColumns } from './use-renown-scoreboard-columns';
function getRowId(player) {
    return player.steamId;
}
export function Scoreboard({ teamName, teamScore, players, scoreOppositeTeam, isOnLeetify }) {
    const columns = useRenownScoreboardColumns();
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event, table) => {
        const players = table.getSelectedRows();
        if (players.length !== 1) {
            return;
        }
        showContextMenu(event, React.createElement(RenownScoreboardContextMenu, { steamId: players[0].steamId }));
    };
    const table = useTable({
        columns,
        data: players,
        getRowId,
        rowSelection: 'single',
        onContextMenu,
        sortedColumn: isOnLeetify ? { id: 'leetify-rating', direction: 'desc' } : { id: 'kill-count', direction: 'asc' },
    });
    return (React.createElement("div", { className: "m-auto flex flex-col" },
        React.createElement(TeamScore, { teamName: teamName, teamScore: teamScore, scoreOppositeTeam: scoreOppositeTeam }),
        React.createElement(Table, { table: table })));
}
//# sourceMappingURL=scoreboard.js.map