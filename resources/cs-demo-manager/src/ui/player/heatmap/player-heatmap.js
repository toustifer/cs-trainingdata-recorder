import React, { useEffect, useRef, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Heatmap } from 'csdm/ui/components/heatmap/heatmap';
import { Content } from 'csdm/ui/components/content';
import { Game } from 'csdm/common/types/counter-strike';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { HeatmapProvider } from 'csdm/ui/components/heatmap/heatmap-provider';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useMaps } from 'csdm/ui/maps/use-maps';
import { usePlayerProfileSettings } from 'csdm/ui/settings/use-player-profile-settings';
import { useCurrentPlayerSteamId } from '../use-current-player-steam-id';
import { useHeatmapState } from './use-heatmap-state';
import { PlayerHeatmapFilters } from './player-heatmap-filters';
import { fetchPointsSuccess } from './player-heatmap-actions';
export function PlayerHeatmap() {
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const { games, tagIds, demoSources, demoTypes, startDate, endDate, gameModes, maxRounds } = usePlayerProfileSettings();
    const game = games.includes(Game.CSGO) ? Game.CSGO : Game.CS2;
    const client = useWebSocketClient();
    const steamId = useCurrentPlayerSteamId();
    const { alpha, blur, radius, event, sides, mapName, radarLevel } = useHeatmapState();
    const [points, setPoints] = useState([]);
    const isInitialRender = useRef(true);
    const maps = useMaps();
    // https://github.com/reactwg/react-compiler/discussions/18
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPoints = async (filters) => {
        try {
            const newMapName = filters?.mapName ?? mapName;
            const map = maps.find((map) => {
                return map.name === newMapName && map.game === game;
            });
            const payload = {
                steamId,
                event: filters?.event ?? event,
                mapName: newMapName,
                games,
                startDate,
                endDate,
                demoTypes,
                gameModes,
                maxRounds,
                sides: filters?.sides ?? sides,
                radarLevel: filters?.radarLevel ?? radarLevel,
                sources: demoSources,
                tagIds,
                thresholdZ: map?.thresholdZ ?? null,
            };
            const points = await client.send({
                name: RendererClientMessageName.FetchPlayerHeatmapPoints,
                payload,
            });
            setPoints(points);
            dispatch(fetchPointsSuccess(payload));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'heatmap-error',
                type: 'error',
            });
        }
    };
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            fetchPoints();
        }
    }, [fetchPoints]);
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex h-full" },
            React.createElement(HeatmapProvider, { game: game, mapName: mapName, points: points, radarLevel: radarLevel, alpha: alpha, blur: blur, radius: radius, fetchPoints: fetchPoints },
                React.createElement(PlayerHeatmapFilters, null),
                React.createElement(Heatmap, null)))));
}
//# sourceMappingURL=player-heatmap.js.map