import React from 'react';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useMatchesColumns } from 'csdm/ui/components/matches/use-matches-columns';
import { TableName } from 'csdm/node/settings/table/table-name';
import { MatchCommentWidget } from 'csdm/ui/components/matches/match-comment-widget';
import { selectedMatchesChanged } from '../player-actions';
import { useSelectedMatchChecksums } from './use-selected-match-checksums';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { PlayerMatchContextMenu } from './player-match-context-menu';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
import { useTable } from 'csdm/ui/components/table/use-table';
import { Table } from 'csdm/ui/components/table/table';
import { useTableCommentWidgetVisibility } from 'csdm/ui/components/table/use-table-comment-widget-visibility';
import { usePlayer } from '../use-player';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { DeleteMatchesDialog } from 'csdm/ui/components/dialogs/delete-matches-dialog';
import { RenameMatchDialog } from 'csdm/ui/matches/dialogs/rename-match-dialog';
import { MatchesTagsDialog } from 'csdm/ui/matches/dialogs/tags-dialog';
function getRowId(match) {
    return match.checksum;
}
export function PlayerMatchesTable() {
    const { matches } = usePlayer();
    const dispatch = useDispatch();
    const navigateToMatch = useNavigateToMatch();
    const selectedChecksums = useSelectedMatchChecksums();
    const columns = useMatchesColumns();
    const { showDialog } = useDialog();
    const { showContextMenu } = useContextMenu();
    const { isWidgetVisible, onKeyDown: onKeyDownCommentWidget, showWidget, hideWidget, } = useTableCommentWidgetVisibility();
    const onRowDoubleClick = (match) => {
        navigateToMatch(match.checksum, {
            state: {
                siblingChecksums: table.getRowIds(),
            },
        });
    };
    const onSelectionChanged = (table) => {
        const selectedChecksums = table.getSelectedRowIds();
        dispatch(selectedMatchesChanged({ selectedChecksums }));
    };
    const onContextMenu = (event, table) => {
        showContextMenu(event, React.createElement(PlayerMatchContextMenu, { onCommentClick: showWidget, selectedMatches: table.getSelectedRows(), matchChecksums: table.getRowIds() }));
    };
    const onKeyDown = (event, table) => {
        switch (event.key) {
            case 'Backspace': {
                const checksums = table.getSelectedRows().map((match) => match.checksum);
                showDialog(React.createElement(DeleteMatchesDialog, { checksums: checksums }));
                break;
            }
            case (window.csdm.isMac && 'Enter') || (!window.csdm.isMac && 'F2'):
                showDialog(React.createElement(RenameMatchDialog, { matches: table.getSelectedRows() }));
                break;
            case 't':
                showDialog(React.createElement(MatchesTagsDialog, { matches: table.getSelectedRows() }));
                break;
            default:
                onKeyDownCommentWidget(event);
        }
    };
    const table = useTable({
        columns,
        data: matches,
        rowSelection: 'multiple',
        selectedRowIds: selectedChecksums,
        persistStateKey: TableName.Matches,
        getRowId,
        onContextMenu,
        onSelectionChanged,
        onRowDoubleClick,
        onKeyDown,
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(Table, { table: table }),
        isWidgetVisible && React.createElement(MatchCommentWidget, { onClose: hideWidget, matches: table.getSelectedRows() })));
}
//# sourceMappingURL=player-matches-table.js.map