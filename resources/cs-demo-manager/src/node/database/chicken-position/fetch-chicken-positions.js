import { db } from 'csdm/node/database/database';
import { chickenPositionRowToChickenPosition } from './chicken-position-row-to-chicken-position';
import { fillMissingTicks } from 'csdm/common/array/fill-missing-ticks';
export async function fetchChickenPositions(checksum, roundNumber) {
    const rows = await db
        .selectFrom('chicken_positions')
        .selectAll()
        .distinctOn(['tick', 'x', 'y', 'z'])
        .where('match_checksum', '=', checksum)
        .where('round_number', '=', roundNumber)
        .orderBy('tick')
        .execute();
    const positions = fillMissingTicks(rows.map(chickenPositionRowToChickenPosition));
    return positions;
}
//# sourceMappingURL=fetch-chicken-positions.js.map