import React from 'react';
import { Button } from './button';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
import { Trans } from '@lingui/react/macro';
export function SeeMatchButton({ checksum }) {
    const navigateToMatch = useNavigateToMatch();
    return (React.createElement(Button, { onClick: () => {
            navigateToMatch(checksum);
        } },
        React.createElement(Trans, { context: "Button" }, "See match")));
}
//# sourceMappingURL=see-match-button.js.map