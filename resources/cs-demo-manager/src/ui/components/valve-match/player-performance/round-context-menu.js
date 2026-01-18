import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
export function RoundContextMenu({ round, demoPath }) {
    const { watchDemo } = useCounterStrike();
    const onWatchRoundClick = () => {
        watchDemo({
            demoPath,
            additionalArguments: [`startround:${round.number}`],
        });
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(ContextMenuItem, { onClick: onWatchRoundClick },
            React.createElement(Trans, null, "Watch round"))));
}
//# sourceMappingURL=round-context-menu.js.map