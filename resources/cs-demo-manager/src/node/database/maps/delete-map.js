import { deleteMapImageFiles } from 'csdm/node/filesystem/maps/delete-map-image-files';
import { db } from 'csdm/node/database/database';
export async function deleteMap(map) {
    await db.deleteFrom('maps').where('id', '=', map.id).execute();
    await deleteMapImageFiles(map);
}
//# sourceMappingURL=delete-map.js.map