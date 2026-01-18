import React from 'react';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
import { DetailsItem } from './details-item';
export function NavigateToMatchItem({ checksum, siblingChecksums }) {
    const navigateToMatch = useNavigateToMatch();
    const onClick = () => {
        navigateToMatch(checksum, {
            state: {
                siblingChecksums,
            },
        });
    };
    return React.createElement(DetailsItem, { onClick: onClick });
}
//# sourceMappingURL=navigate-to-match-item.js.map