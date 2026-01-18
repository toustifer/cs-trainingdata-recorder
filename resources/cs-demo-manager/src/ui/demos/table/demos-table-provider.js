import React, { useEffect } from 'react';
import { useDemosColumns } from './use-demos-columns';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useNavigateToDemo } from 'csdm/ui/hooks/use-navigate-to-demo';
import { useDemos } from '../use-demos';
import { useFuzzySearchText } from '../use-fuzzy-search-text';
import { useDemosStatus } from '../use-demos-status';
import { Status } from 'csdm/common/types/status';
import { useTable } from 'csdm/ui/components/table/use-table';
import { DemoContextMenu } from './demo-context-menu';
import { TableName } from 'csdm/node/settings/table/table-name';
import { DemoCommentWidget } from './demo-comment-widget';
import { DemosTableContext } from './demos-table-context';
import { DeleteDemosDialog } from 'csdm/ui/components/dialogs/delete-demos-dialog';
import { RenameDemoDialog } from './rename-demo-dialog';
import { selectionChanged } from '../demos-actions';
import { useDemosState } from '../use-demos-state';
import { useFetchDemos } from '../use-fetch-demos';
import { useTableCommentWidgetVisibility } from 'csdm/ui/components/table/use-table-comment-widget-visibility';
import { DemosTagsDialog } from './tags-dialog';
import { useUiSettings } from 'csdm/ui/settings/ui/use-ui-settings';
import { useIsDemoInDatabase } from 'csdm/ui/demo/use-is-demo-in-database';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
function getRowId(demo) {
    return demo.filePath;
}
const fuzzySearchColumnIds = ['checksum', 'name', 'mapName', 'serverName', 'clientName', 'source'];
export function DemosTableProvider({ children }) {
    const dispatch = useDispatch();
    const navigateToDemo = useNavigateToDemo();
    const navigateToMatch = useNavigateToMatch();
    const demos = useDemos();
    const fuzzySearchText = useFuzzySearchText();
    const columns = useDemosColumns();
    const { showContextMenu } = useContextMenu();
    const { redirectDemoToMatch } = useUiSettings();
    const isDemoInDatabase = useIsDemoInDatabase();
    const selectedDemosPaths = useDemosState().selectedDemosPath;
    const status = useDemosStatus();
    const { isWidgetVisible, onKeyDown: onKeyDownCommentWidget, showWidget, hideWidget, } = useTableCommentWidgetVisibility();
    const { showDialog } = useDialog();
    const fetchDemos = useFetchDemos();
    useEffect(() => {
        if (status === Status.Idle) {
            fetchDemos();
        }
    });
    const onContextMenu = (event, table) => {
        showContextMenu(event, React.createElement(DemoContextMenu, { demos: table.getSelectedRows(), onCommentClick: showWidget, siblingDemoPaths: table.getRowIds() }));
    };
    const handleNavigateToDemo = (demo, table) => {
        if (redirectDemoToMatch && isDemoInDatabase(demo.checksum)) {
            navigateToMatch(demo.checksum);
        }
        else {
            navigateToDemo(demo.filePath, {
                state: {
                    siblingDemoPaths: table.getRowIds(),
                },
            });
        }
    };
    const onKeyDown = (event, table) => {
        switch (event.key) {
            case 'Backspace':
                showDialog(React.createElement(DeleteDemosDialog, { demos: table.getSelectedRows() }));
                break;
            case (window.csdm.isMac && 'Enter') || (!window.csdm.isMac && 'F2'):
                showDialog(React.createElement(RenameDemoDialog, { demos: table.getSelectedRows() }));
                break;
            case 't':
                showDialog(React.createElement(DemosTagsDialog, { demos: table.getSelectedRows() }));
                break;
            default:
                onKeyDownCommentWidget(event);
        }
    };
    const onSelectionChanged = (table) => {
        const selectedDemosPaths = table.getSelectedRowIds();
        dispatch(selectionChanged({
            demosPath: selectedDemosPaths,
        }));
    };
    const table = useTable({
        columns,
        data: demos,
        getRowId,
        persistStateKey: TableName.Demos,
        persistScrollKey: TableName.Demos,
        rowSelection: 'multiple',
        fuzzySearchText,
        fuzzySearchColumnIds,
        selectedRowIds: selectedDemosPaths,
        onRowDoubleClick: handleNavigateToDemo,
        onSelectWithKeyboard: handleNavigateToDemo,
        onContextMenu,
        onKeyDown,
        onSelectionChanged,
        sortedColumn: { id: 'date', direction: 'desc' },
    });
    return (React.createElement(DemosTableContext.Provider, { value: table },
        children,
        isWidgetVisible && React.createElement(DemoCommentWidget, { onClose: hideWidget, demos: table.getSelectedRows() })));
}
//# sourceMappingURL=demos-table-provider.js.map