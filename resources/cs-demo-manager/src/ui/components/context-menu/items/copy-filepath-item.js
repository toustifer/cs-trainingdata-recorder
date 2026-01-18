import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function CopyFilepathItem({ filepaths }) {
    const onClick = () => {
        navigator.clipboard.writeText(filepaths.join('\n'));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Copy context menu" }, "File path")));
}
//# sourceMappingURL=copy-filepath-item.js.map