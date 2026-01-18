import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useNavigateToDemo } from 'csdm/ui/hooks/use-navigate-to-demo';
import { ContextMenuItem } from '../context-menu-item';
export function NavigateToMatchesDemoItem({ matches }) {
    const navigateToDemo = useNavigateToDemo();
    const isDisabled = matches.length !== 1;
    const onClick = () => {
        const [match] = matches;
        navigateToDemo(match.demoFilePath, {
            state: {
                siblingDemoPaths: matches.map((match) => match.demoFilePath),
                checksum: match.checksum,
            },
        });
    };
    return (React.createElement(ContextMenuItem, { isDisabled: isDisabled, onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "See demo")));
}
//# sourceMappingURL=navigate-to-matches-demo-item.js.map