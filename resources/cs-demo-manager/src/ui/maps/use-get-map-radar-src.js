import { RadarLevel } from 'csdm/ui/maps/radar-level';
import { useMapsState } from './use-maps-state';
import { Game } from 'csdm/common/types/counter-strike';
export function useGetMapRadarSrc() {
    const { entities: maps, cacheTimestamp } = useMapsState();
    return (mapName, game, radarLevel = RadarLevel.Upper) => {
        const possibleMaps = maps.filter((map) => map.name === mapName);
        if (possibleMaps.length === 0) {
            return undefined;
        }
        let map;
        switch (game) {
            case Game.CSGO:
                map = possibleMaps.find((map) => map.game === game);
                break;
            case Game.CS2:
            case Game.CS2LT:
            default:
                // When the game is not specified we try to find the CS2 map first since it's the most recent game
                map = possibleMaps.find((map) => map.game === Game.CS2 || map.game === Game.CS2LT);
                break;
        }
        if (!map && possibleMaps.length > 0) {
            map = possibleMaps[0];
        }
        if (!map) {
            return undefined;
        }
        const radarFilePath = radarLevel === RadarLevel.Upper ? map.radarFilePath : map.lowerRadarFilePath;
        if (radarFilePath === undefined) {
            return undefined;
        }
        return `file://${radarFilePath}?timestamp=${cacheTimestamp}`;
    };
}
//# sourceMappingURL=use-get-map-radar-src.js.map