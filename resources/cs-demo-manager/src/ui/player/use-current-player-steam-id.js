import { useParams } from 'react-router';
export function useCurrentPlayerSteamId() {
    const { steamId } = useParams();
    if (typeof steamId !== 'string') {
        throw new TypeError('steamId is not a string');
    }
    return steamId;
}
//# sourceMappingURL=use-current-player-steam-id.js.map