import React from 'react';
import { MapEntry } from './map-entry';
import { useGameMaps } from 'csdm/ui/maps/use-game-maps';
export function Maps({ game }) {
    const maps = useGameMaps(game);
    return (React.createElement("div", { className: "flex flex-wrap gap-8" }, maps.map((map) => (React.createElement(MapEntry, { key: map.id, map: map })))));
}
//# sourceMappingURL=maps.js.map