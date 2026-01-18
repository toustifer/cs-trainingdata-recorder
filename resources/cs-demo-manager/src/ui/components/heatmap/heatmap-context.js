import { Game } from 'csdm/common/types/counter-strike';
import { RadarLevel } from 'csdm/ui/maps/radar-level';
import { createContext, useContext } from 'react';
export const HeatmapContext = createContext({
    radius: 0,
    blur: 0,
    alpha: 0,
    mapName: '',
    radarLevel: RadarLevel.Upper,
    game: Game.CS2,
    points: [],
    fetchPoints: () => {
        throw new Error('fetchPoints not implemented');
    },
});
export function useHeatmapContext() {
    return useContext(HeatmapContext);
}
//# sourceMappingURL=heatmap-context.js.map