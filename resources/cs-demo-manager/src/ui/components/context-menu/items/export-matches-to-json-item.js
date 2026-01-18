import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useDialog } from '../../dialogs/use-dialog';
import { ExportMatchesToJsonDialog } from '../../dialogs/export-matches-to-json-dialog';
export function ExportMatchesToJsonItem({ checksums }) {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(ExportMatchesToJsonDialog, { checksums: checksums }));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "JSON")));
}
//# sourceMappingURL=export-matches-to-json-item.js.map