import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function FiveEPlayScoreboardContextMenu({ domainId }) {
    const onOpenClick = () => {
        window.open(`https://arena.5eplay.com/data/player/${domainId}`, '_blank');
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(ContextMenuItem, { onClick: onOpenClick },
            React.createElement(Trans, { context: "Context menu" }, "Open 5EPlay profile"))));
}
//# sourceMappingURL=5eplay-scoreboard-context-menu.js.map