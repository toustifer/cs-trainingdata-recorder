import React from 'react';
import { ExportHeatmapButton } from 'csdm/ui/components/heatmap/export-heatmap-button';
import { HeatmapInputRadius } from 'csdm/ui/components/heatmap/input-radius';
import { HeatmapInputBlur } from 'csdm/ui/components/heatmap/input-blur';
import { HeatmapInputOpacity } from 'csdm/ui/components/heatmap/heatmap-input-opacity';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { blurChanged, opacityChanged, radiusChanged } from 'csdm/ui/team/heatmap/team-heatmap-actions';
import { RadarLevelSelect } from 'csdm/ui/components/inputs/select/radar-level-select';
import { useHeatmapContext } from 'csdm/ui/components/heatmap/heatmap-context';
import { HeatmapSideSelect } from 'csdm/ui/components/heatmap/heatmap-side-select';
import { useHeatmapState } from './use-heatmap-state';
import { HeatmapSelectEvent } from 'csdm/ui/components/heatmap/heatmap-select-event';
import { HeatmapFilters } from 'csdm/ui/components/heatmap/heatmap-filters';
import { useTeam } from 'csdm/ui/team/use-team';
import { HeatmapSelectMap } from 'csdm/ui/components/heatmap/heatmap-select-map';
import { ResetZoomButton } from 'csdm/ui/components/heatmap/reset-zoom-button';
import { SearchPlayersInput } from 'csdm/ui/search/filters/search-players-input';
export function TeamHeatmapFilters() {
    const dispatch = useDispatch();
    const { mapName, game, radarLevel, fetchPoints } = useHeatmapContext();
    const { sides, event, players } = useHeatmapState();
    const { mapsStats } = useTeam();
    const mapNames = mapsStats.map(({ mapName }) => {
        return mapName;
    });
    return (React.createElement(HeatmapFilters, null,
        React.createElement(HeatmapInputRadius, { onChange: (radius) => {
                dispatch(radiusChanged(radius));
            } }),
        React.createElement(HeatmapInputBlur, { onChange: (blur) => {
                dispatch(blurChanged(blur));
            } }),
        React.createElement(HeatmapInputOpacity, { onChange: (opacity) => {
                dispatch(opacityChanged(opacity));
            } }),
        React.createElement(HeatmapSelectMap, { mapNames: mapNames }),
        React.createElement(HeatmapSelectEvent, { event: event, onChange: (event) => {
                fetchPoints({ event });
            } }),
        React.createElement(SearchPlayersInput, { isDisabled: false, selectedPlayers: players, onPlayerSelected: (player) => {
                fetchPoints({ players: [...players, player] });
            }, onPlayerRemoved: (player) => {
                fetchPoints({ players: players.filter(({ steamId }) => steamId !== player.steamId) });
            } }),
        React.createElement(RadarLevelSelect, { mapName: mapName, game: game, onChange: (radarLevel) => {
                fetchPoints({ radarLevel });
            }, selectedRadarLevel: radarLevel }),
        React.createElement(HeatmapSideSelect, { sides: sides, onChange: (sides) => {
                fetchPoints({ sides });
            } }),
        React.createElement("div", { className: "flex flex-wrap gap-x-8" },
            React.createElement(ResetZoomButton, null),
            React.createElement(ExportHeatmapButton, null))));
}
//# sourceMappingURL=team-heatmap-filters.js.map