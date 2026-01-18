import { HeatmapEvent } from 'csdm/common/types/heatmap-event';
import { fetchMatchKillsPoints } from 'csdm/node/database/heatmap/fetch-match-kills-points';
import { fetchMatchShotsPoints } from 'csdm/node/database/heatmap/fetch-match-shots-points';
import { fetchMatchGrenadePoints } from 'csdm/node/database/heatmap/fetch-match-grenade-points';
import { assertNever } from 'csdm/common/assert-never';
import { handleError } from '../../handle-error';
export async function fetchMatchHeatmapPointsHandler(filter) {
    try {
        let points = [];
        switch (filter.event) {
            case HeatmapEvent.Kills:
            case HeatmapEvent.Deaths:
                points = await fetchMatchKillsPoints(filter);
                break;
            case HeatmapEvent.Shots:
                points = await fetchMatchShotsPoints(filter);
                break;
            case HeatmapEvent.Molotov:
            case HeatmapEvent.HeGrenade:
            case HeatmapEvent.Flashbang:
            case HeatmapEvent.Smoke:
            case HeatmapEvent.Decoy:
                points = await fetchMatchGrenadePoints(filter);
                break;
            default:
                assertNever(filter.event, `Unsupported heatmap event: ${filter.event}`);
        }
        return points;
    }
    catch (error) {
        handleError(error, 'Error while fetching match heatmap points');
    }
}
//# sourceMappingURL=fetch-match-heatmap-points-handler.js.map