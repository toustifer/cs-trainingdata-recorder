import React, {} from 'react';
import { HeatmapContext } from './heatmap-context';
export function HeatmapProvider({ alpha, blur, children, fetchPoints, game, mapName, points, radarLevel, radius, }) {
    return (React.createElement(HeatmapContext.Provider, { value: {
            alpha,
            blur,
            fetchPoints,
            game,
            mapName,
            points,
            radarLevel,
            radius,
        } }, children));
}
//# sourceMappingURL=heatmap-provider.js.map