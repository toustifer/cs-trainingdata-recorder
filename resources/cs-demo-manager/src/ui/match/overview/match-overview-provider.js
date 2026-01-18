import React from 'react';
import { TableName } from 'csdm/node/settings/table/table-name';
import { useCurrentMatch } from '../use-current-match';
import { useScoreboardColumns } from './scoreboard/use-scoreboard-columns';
import { useNavigateToMatchPlayer } from 'csdm/ui/hooks/navigation/use-navigate-to-match-player';
import { ScoreboardContextMenu } from './scoreboard/context-menu/scoreboard-context-menu';
import { MatchOverviewContext } from './match-overview-context';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { useTable } from 'csdm/ui/components/table/use-table';
import { isDefuseMapFromName } from 'csdm/common/counter-strike/is-defuse-map-from-name';
function getRowId(player) {
    return player.steamId;
}
export function MatchOverviewProvider({ children }) {
    const match = useCurrentMatch();
    const playersTeamA = match.players.filter((player) => player.teamName === match.teamA.name);
    const playersTeamB = match.players.filter((player) => player.teamName === match.teamB.name);
    const isDefuseMap = isDefuseMapFromName(match.mapName);
    const { showContextMenu } = useContextMenu();
    const columns = useScoreboardColumns(isDefuseMap);
    const navigateToMatchPlayer = useNavigateToMatchPlayer();
    const onContextMenu = (event, table) => {
        const players = table.getSelectedRows();
        if (players.length !== 1) {
            return;
        }
        const [player] = players;
        showContextMenu(event, React.createElement(ScoreboardContextMenu, { steamId: player.steamId, name: player.name, demoPath: match.demoFilePath }));
    };
    const navigateToPlayer = (player) => {
        navigateToMatchPlayer(match.checksum, player.steamId);
    };
    const tableTeamA = useTable({
        columns,
        data: playersTeamA,
        rowSelection: 'single',
        persistStateKey: TableName.MatchScoreboard,
        getRowId,
        onContextMenu,
        onRowDoubleClick: navigateToPlayer,
        onSelectWithKeyboard: navigateToPlayer,
        sortedColumn: { id: 'damage-health', direction: 'desc' },
    });
    const tableTeamB = useTable({
        columns,
        data: playersTeamB,
        rowSelection: 'single',
        persistStateKey: TableName.MatchScoreboard,
        getRowId,
        onContextMenu,
        onRowDoubleClick: navigateToPlayer,
        onSelectWithKeyboard: navigateToPlayer,
        sortedColumn: { id: 'damage-health', direction: 'desc' },
    });
    return (React.createElement(MatchOverviewContext.Provider, { value: { tableTeamA, tableTeamB } }, children({ tableTeamA, tableTeamB })));
}
//# sourceMappingURL=match-overview-provider.js.map