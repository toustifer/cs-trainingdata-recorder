import React from 'react';
import { ExportHeatmapButton } from 'csdm/ui/components/heatmap/export-heatmap-button';
import { HeatmapInputRadius } from 'csdm/ui/components/heatmap/input-radius';
import { HeatmapInputBlur } from 'csdm/ui/components/heatmap/input-blur';
import { HeatmapSideSelect } from 'csdm/ui/components/heatmap/heatmap-side-select';
import { HeatmapInputOpacity } from 'csdm/ui/components/heatmap/heatmap-input-opacity';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { blurChanged, opacityChanged, radiusChanged } from './match-heatmap-actions';
import { HeatmapSelectEvent } from 'csdm/ui/components/heatmap/heatmap-select-event';
import { useHeatmapState } from './use-heatmap-state';
import { useHeatmapContext } from 'csdm/ui/components/heatmap/heatmap-context';
import { RadarLevelSelect } from 'csdm/ui/components/inputs/select/radar-level-select';
import { RoundsSelect } from 'csdm/ui/components/inputs/select/rounds-select';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { TeamsSelect } from 'csdm/ui/components/inputs/select/teams-select';
import { PlayersSelect } from 'csdm/ui/components/inputs/select/players-select';
import { HeatmapFilters } from 'csdm/ui/components/heatmap/heatmap-filters';
import { ResetZoomButton } from 'csdm/ui/components/heatmap/reset-zoom-button';
export function MatchHeatmapFilters() {
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const { event, radarLevel, rounds, sides, teamNames, steamIds } = useHeatmapState();
    const { mapName, game, fetchPoints } = useHeatmapContext();
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
        React.createElement(HeatmapSelectEvent, { event: event, onChange: (event) => {
                fetchPoints({ event });
            } }),
        React.createElement(RadarLevelSelect, { mapName: mapName, game: game, onChange: (radarLevel) => {
                fetchPoints({ radarLevel });
            }, selectedRadarLevel: radarLevel }),
        React.createElement(RoundsSelect, { onChange: (rounds) => {
                fetchPoints({ rounds });
            }, rounds: match.rounds, selectedRoundNumbers: rounds }),
        React.createElement(HeatmapSideSelect, { sides: sides, onChange: (sides) => {
                fetchPoints({ sides });
            } }),
        React.createElement(TeamsSelect, { teamNameA: match.teamA.name, teamNameB: match.teamB.name, selectedTeamNames: teamNames, onChange: (teamName) => {
                fetchPoints({ teamNames: teamName ? [teamName] : [] });
            } }),
        React.createElement(PlayersSelect, { players: match.players, selectedSteamIds: steamIds, onChange: (steamIds) => {
                fetchPoints({ steamIds });
            } }),
        React.createElement("div", { className: "flex flex-wrap gap-x-8" },
            React.createElement(ResetZoomButton, null),
            React.createElement(ExportHeatmapButton, null))));
}
//# sourceMappingURL=match-heatmap-filters.js.map