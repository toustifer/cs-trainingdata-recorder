import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from '../hooks/use-web-socket-client';
import { usePlayerProfileSettings } from '../settings/use-player-profile-settings';
import { useDispatch } from '../store/use-dispatch';
import { fetchPlayerError, fetchPlayerStart, fetchPlayerSuccess } from './player-actions';
import { useCurrentPlayerSteamId } from './use-current-player-steam-id';
export function useFetchPlayer() {
    const dispatch = useDispatch();
    const client = useWebSocketClient();
    const steamId = useCurrentPlayerSteamId();
    const { updateSettings, demoSources, games, demoTypes, ranking, gameModes, tagIds, maxRounds, startDate, endDate } = usePlayerProfileSettings();
    return async (filters) => {
        try {
            const payload = {
                steamId,
                startDate,
                endDate,
                demoSources,
                games,
                demoTypes,
                ranking,
                gameModes,
                tagIds,
                maxRounds,
                ...filters,
            };
            dispatch(fetchPlayerStart());
            await updateSettings({
                demoSources: filters?.demoSources ?? demoSources,
                games: filters?.games ?? games,
                gameModes: filters?.gameModes ?? gameModes,
                demoTypes: filters?.demoTypes ?? demoTypes,
                ranking: filters?.ranking ?? ranking,
                tagIds: filters?.tagIds ?? tagIds,
                maxRounds: filters?.maxRounds ?? maxRounds,
                startDate: filters && 'startDate' in filters ? filters.startDate : startDate,
                endDate: filters && 'endDate' in filters ? filters.endDate : endDate,
            });
            const player = await client.send({
                name: RendererClientMessageName.FetchPlayerStats,
                payload,
            });
            dispatch(fetchPlayerSuccess(player));
        }
        catch (error) {
            dispatch(fetchPlayerError({ errorCode: error }));
        }
    };
}
//# sourceMappingURL=use-fetch-player.js.map