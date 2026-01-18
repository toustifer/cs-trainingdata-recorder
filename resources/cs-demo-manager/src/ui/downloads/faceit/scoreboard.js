import React from 'react';
import { TeamScore } from 'csdm/ui/components/match/team-score';
import { useFaceitScoreboardColumns } from './use-faceit-scoreboard-columns';
import { useTable } from 'csdm/ui/components/table/use-table';
import { Table } from 'csdm/ui/components/table/table';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { FaceitScoreboardContextMenu } from './faceit-scoreboard-context-menu';
function getRowId(player) {
    return player.id;
}
export function Scoreboard({ teamName, teamScore, players, scoreOppositeTeam }) {
    const columns = useFaceitScoreboardColumns();
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event, table) => {
        const players = table.getSelectedRows();
        if (players.length !== 1) {
            return;
        }
        showContextMenu(event, React.createElement(FaceitScoreboardContextMenu, { playerNickname: players[0].name }));
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
//# sourceMappingURL=scoreboard.js.map