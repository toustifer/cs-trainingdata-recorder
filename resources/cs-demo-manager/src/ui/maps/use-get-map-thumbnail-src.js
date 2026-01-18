import { Game } from 'csdm/common/types/counter-strike';
import { useMapsState } from './use-maps-state';
export function useGetMapThumbnailSrc() {
    const { entities: maps, cacheTimestamp } = useMapsState();
    return (name, game) => {
        const possibleMaps = maps.filter((map) => map.name === name);
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
        const thumbnailFilePath = map?.thumbnailFilePath ?? window.csdm.unknownImageFilePath;
        return `file://${thumbnailFilePath}?timestamp=${cacheTimestamp}`;
    };
}
//# sourceMappingURL=use-get-map-thumbnail-src.js.map