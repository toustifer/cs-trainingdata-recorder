import { HeatmapEvent } from 'csdm/common/types/heatmap-event';
import { assertNever } from 'csdm/common/assert-never';
import { handleError } from '../../handle-error';
import { fetchPlayerKillsPoints } from 'csdm/node/database/heatmap/fetch-player-kills-points';
import { fetchPlayerShotsPoints } from 'csdm/node/database/heatmap/fetch-player-shots-points';
import { fetchPlayerGrenadePoints } from 'csdm/node/database/heatmap/fetch-player-grenade-points';
export async function fetchPlayerHeatmapPointsHandler(filter) {
    try {
        let points = [];
        switch (filter.event) {
            case HeatmapEvent.Kills:
            case HeatmapEvent.Deaths:
                points = await fetchPlayerKillsPoints(filter);
                break;
            case HeatmapEvent.Shots:
                points = await fetchPlayerShotsPoints(filter);
                break;
            case HeatmapEvent.Molotov:
            case HeatmapEvent.HeGrenade:
            case HeatmapEvent.Flashbang:
            case HeatmapEvent.Smoke:
            case HeatmapEvent.Decoy:
                points = await fetchPlayerGrenadePoints(filter);
                break;
            default:
                assertNever(filter.event, `Unsupported heatmap event: ${filter.event}`);
        }
        return points;
    }
    catch (error) {
        handleError(error, 'Error while fetching player heatmap points');
    }
}
//# sourceMappingURL=fetch-player-heatmap-points-handler.js.map