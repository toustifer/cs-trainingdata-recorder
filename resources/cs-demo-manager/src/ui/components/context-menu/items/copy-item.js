import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
export function CopyItem({ children }) {
    return React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Copy") }, children);
}
//# sourceMappingURL=copy-item.js.map