import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function ExportToXlsxItem({ onClick }) {
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "XLSX")));
}
//# sourceMappingURL=export-to-xlsx-item.js.map