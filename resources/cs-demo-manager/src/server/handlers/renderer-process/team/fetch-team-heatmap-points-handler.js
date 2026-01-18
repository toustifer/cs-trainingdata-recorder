import { HeatmapEvent } from 'csdm/common/types/heatmap-event';
import { assertNever } from 'csdm/common/assert-never';
import { fetchTeamKillsPoints } from 'csdm/node/database/heatmap/fetch-team-kills-points';
import { fetchTeamShotsPoints } from 'csdm/node/database/heatmap/fetch-team-shots-points';
import { fetchTeamGrenadePoints } from 'csdm/node/database/heatmap/fetch-team-grenade-points';
import { handleError } from '../../handle-error';
export async function fetchTeamHeatmapPointsHandler(filter) {
    try {
        let points = [];
        switch (filter.event) {
            case HeatmapEvent.Kills:
            case HeatmapEvent.Deaths:
                points = await fetchTeamKillsPoints(filter);
                break;
            case HeatmapEvent.Shots:
                points = await fetchTeamShotsPoints(filter);
                break;
            case HeatmapEvent.Molotov:
            case HeatmapEvent.HeGrenade:
            case HeatmapEvent.Flashbang:
            case HeatmapEvent.Smoke:
            case HeatmapEvent.Decoy:
                points = await fetchTeamGrenadePoints(filter);
                break;
            default:
                assertNever(filter.event, `Unsupported heatmap event: ${filter.event}`);
        }
        return points;
    }
    catch (error) {
        handleError(error, 'Error while fetching team heatmap points');
    }
}
//# sourceMappingURL=fetch-team-heatmap-points-handler.js.map