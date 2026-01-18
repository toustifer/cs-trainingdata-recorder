import React from 'react';
import { usePlayer } from '../use-player';
import { MapsStats } from 'csdm/ui/components/maps-stats';
export function PlayerMaps() {
    const { mapsStats } = usePlayer();
    return React.createElement(MapsStats, { mapsStats: mapsStats });
}
//# sourceMappingURL=player-maps.js.map