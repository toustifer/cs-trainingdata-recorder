import React from 'react';
import { DemosActionBar } from 'csdm/ui/demos/action-bar/action-bar';
import { DemosTableStatusBar } from 'csdm/ui/demos/table/demos-table-status-bar';
import { CurrentFolderSelect } from './current-folder-select';
import { DemosTableProvider } from './table/demos-table-provider';
import { DemosTable } from './table/demos-table';
export function Demos() {
    return (React.createElement(DemosTableProvider, null,
        React.createElement(DemosActionBar, null),
        React.createElement(CurrentFolderSelect, null),
        React.createElement(DemosTable, null),
        React.createElement(DemosTableStatusBar, null)));
}
//# sourceMappingURL=demos.js.map