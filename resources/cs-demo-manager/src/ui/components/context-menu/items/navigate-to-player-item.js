import React from 'react';
import { useNavigateToPlayer } from 'csdm/ui/hooks/use-navigate-to-player';
import { DetailsItem } from './details-item';
export function NavigateToPlayerItem({ steamId }) {
    const navigateToPlayer = useNavigateToPlayer();
    const onClick = () => {
        navigateToPlayer(steamId);
    };
    return React.createElement(DetailsItem, { onClick: onClick });
}
//# sourceMappingURL=navigate-to-player-item.js.map