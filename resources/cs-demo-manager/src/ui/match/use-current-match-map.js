import { useMaps } from 'csdm/ui/maps/use-maps';
import { useCurrentMatch } from './use-current-match';
export function useCurrentMatchMap() {
    const match = useCurrentMatch();
    const maps = useMaps();
    return maps.find((map) => map.name === match.mapName && map.game === match.game);
}
//# sourceMappingURL=use-current-match-map.js.map