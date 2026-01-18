import React, { useEffect, useRef, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Heatmap } from 'csdm/ui/components/heatmap/heatmap';
import { MatchHeatmapFilters } from 'csdm/ui/match/heatmap/match-heatmap-filters';
import { Content } from 'csdm/ui/components/content';
import { useCurrentMatch } from '../use-current-match';
import { useHeatmapState } from './use-heatmap-state';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { fetchPointsSuccess } from './match-heatmap-actions';
import { HeatmapProvider } from 'csdm/ui/components/heatmap/heatmap-provider';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { useCurrentMatchMap } from '../use-current-match-map';
export function MatchHeatmap() {
    const match = useCurrentMatch();
    const map = useCurrentMatchMap();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const { alpha, blur, radius, event, sides, radarLevel, rounds, steamIds, teamNames } = useHeatmapState();
    const [points, setPoints] = useState([]);
    const isInitialRender = useRef(true);
    // https://github.com/reactwg/react-compiler/discussions/18
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchPoints = async (filters) => {
        try {
            const payload = {
                checksum: match.checksum,
                event: filters?.event ?? event,
                rounds: filters?.rounds ?? rounds,
                sides: filters?.sides ?? sides,
                teamNames: filters?.teamNames ?? teamNames,
                steamIds: filters?.steamIds ?? steamIds,
                radarLevel: filters?.radarLevel ?? radarLevel,
                thresholdZ: filters?.thresholdZ ?? map?.thresholdZ ?? null,
            };
            const points = await client.send({
                name: RendererClientMessageName.FetchMatchHeatmapPoints,
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
            React.createElement(HeatmapProvider, { game: match.game, mapName: match.mapName, points: points, radarLevel: radarLevel, alpha: alpha, blur: blur, radius: radius, fetchPoints: fetchPoints },
                React.createElement(MatchHeatmapFilters, null),
                React.createElement(Heatmap, null)))));
}
//# sourceMappingURL=match-heatmap.js.map