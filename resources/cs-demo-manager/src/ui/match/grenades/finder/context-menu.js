import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { useCurrentMatch } from '../../use-current-match';
import { isCounterStrikeStartable } from 'csdm/ui/hooks/use-counter-strike';
export function GrenadesFinderContextMenu({ grenadeThrow, onWatchClick }) {
    const match = useCurrentMatch();
    const onCopyPositionClick = () => {
        if (grenadeThrow === undefined || grenadeThrow.positions.length === 0) {
            return;
        }
        const [firstPosition] = grenadeThrow.positions;
        const command = `setpos ${firstPosition.x} ${firstPosition.y} ${firstPosition.z}; setang ${grenadeThrow.throwerPitch} ${grenadeThrow.throwerYaw}`;
        navigator.clipboard.writeText(command);
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(ContextMenuItem, { onClick: onCopyPositionClick }, React.createElement(Trans, { context: "Context menu" }, "Copy position")),
        isCounterStrikeStartable(match.game) && (React.createElement(ContextMenuItem, { onClick: onWatchClick }, React.createElement(Trans, { context: "Context menu" }, "Watch")))));
}
//# sourceMappingURL=context-menu.js.map