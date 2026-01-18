import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { ExportToXlsxItem } from 'csdm/ui/components/context-menu/items/export-to-xlsx-item';
import { ExportPlayersToXlsxDialog } from './export-players-to-xlsx-dialog';
export function ExportPlayersItem({ steamIds }) {
    const { showDialog } = useDialog();
    if (steamIds.length === 0) {
        return null;
    }
    const onExportToXlsxClick = () => {
        showDialog(React.createElement(ExportPlayersToXlsxDialog, { steamIds: steamIds }));
    };
    return (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Export") },
        React.createElement(ExportToXlsxItem, { onClick: onExportToXlsxClick })));
}
//# sourceMappingURL=export-players-item.js.map