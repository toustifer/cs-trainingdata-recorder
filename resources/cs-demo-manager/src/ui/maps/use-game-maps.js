import { useMaps } from './use-maps';
export function useGetGameMaps() {
    const maps = useMaps();
    return (game) => {
        return maps.filter((map) => map.game === game);
    };
}
export function useGameMaps(game) {
    const getGameMaps = useGetGameMaps();
    return getGameMaps(game);
}
//# sourceMappingURL=use-game-maps.js.map