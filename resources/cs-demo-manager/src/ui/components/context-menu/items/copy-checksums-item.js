import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function CopyChecksumsItem({ checksums }) {
    const onClick = () => {
        navigator.clipboard.writeText(checksums.join(','));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Copy context menu" }, "Checksum")));
}
//# sourceMappingURL=copy-checksums-item.js.map