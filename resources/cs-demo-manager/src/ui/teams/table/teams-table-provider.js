import React from 'react';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { useTable } from 'csdm/ui/components/table/use-table';
import { TableName } from 'csdm/node/settings/table/table-name';
import { useNavigateToTeam } from 'csdm/ui/hooks/use-navigate-to-team';
import { useTeams } from '../use-teams';
import { useTeamsColumns } from './use-teams-columns';
import { useSelectedTeamNames } from '../use-selected-team-names';
import { useFuzzySearchText } from '../use-fuzzy-search-text';
import { TeamContextMenu } from './team-context-menu';
import { selectionChanged } from '../teams-actions';
import { TeamsTableContext } from './teams-table-context';
function getRowId(row) {
    return row.name;
}
const fuzzySearchColumnIds = ['name'];
export function TeamsTableProvider({ children }) {
    const dispatch = useDispatch();
    const { showContextMenu } = useContextMenu();
    const navigateToTeam = useNavigateToTeam();
    const teams = useTeams();
    const columns = useTeamsColumns();
    const selectedTeamNames = useSelectedTeamNames();
    const fuzzySearchText = useFuzzySearchText();
    const showTeam = (team) => {
        navigateToTeam(team.name);
    };
    const onContextMenu = (event, table) => {
        showContextMenu(event, React.createElement(TeamContextMenu, { teamNames: table.getSelectedRowIds() }));
    };
    const onSelectionChanged = (table) => {
        const selectedNames = table.getSelectedRowIds();
        dispatch(selectionChanged({
            names: selectedNames,
        }));
    };
    const table = useTable({
        columns,
        data: teams,
        getRowId,
        persistStateKey: TableName.Teams,
        persistScrollKey: TableName.Teams,
        rowSelection: 'multiple',
        fuzzySearchColumnIds,
        fuzzySearchText,
        selectedRowIds: selectedTeamNames,
        onContextMenu,
        onSelectionChanged,
        onRowDoubleClick: showTeam,
        onSelectWithKeyboard: showTeam,
        sortedColumn: { id: 'match-count', direction: 'desc' },
    });
    return React.createElement(TeamsTableContext.Provider, { value: table }, children);
}
//# sourceMappingURL=teams-table-provider.js.map