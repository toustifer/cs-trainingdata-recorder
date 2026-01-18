import React from 'react';
import { useValveScoreboardColumns } from './use-valve-scoreboard-columns';
import { Table } from '../table/table';
import { useTable } from '../table/use-table';
import { useContextMenu } from '../context-menu/use-context-menu';
import { ValveScoreboardContextMenu } from './valve-scoreboard-context-menu';
function getRowId(player) {
    return player.steamId;
}
export function ValveMatchScoreboard({ players, demoPath, game, onPlayerSelected }) {
    const { showContextMenu } = useContextMenu();
    const columns = useValveScoreboardColumns();
    const onSelectionChanged = (table) => {
        const selectedPlayers = table.getSelectedRows();
        if (selectedPlayers.length > 0) {
            onPlayerSelected(selectedPlayers[0]);
        }
    };
    const onContextMenu = (event, table) => {
        const players = table.getSelectedRows();
        if (players.length !== 1) {
            return;
        }
        showContextMenu(event, React.createElement(ValveScoreboardContextMenu, { steamId: players[0].steamId, demoPath: demoPath, game: game }));
    };
    const table = useTable({
        columns,
        data: players,
        getRowId,
        rowSelection: 'single',
        onSelectionChanged,
        onContextMenu,
        sortedColumn: { id: 'kill-count', direction: 'desc' },
    });
    return React.createElement(Table, { table: table });
}
//# sourceMappingURL=valve-match-scoreboard.js.map