import { db } from 'csdm/node/database/database';
import { cameraRowToCamera } from './camera-row-to-camera';
export async function fetchCameras(game) {
    const query = db.selectFrom('cameras').selectAll().orderBy('name');
    if (game) {
        query.where('game', '=', game);
    }
    const rows = await query.execute();
    const cameras = await Promise.all(rows.map(cameraRowToCamera));
    return cameras;
}
//# sourceMappingURL=fetch-cameras.js.map