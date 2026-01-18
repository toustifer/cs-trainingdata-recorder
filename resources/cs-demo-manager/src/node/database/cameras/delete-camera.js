import { db } from 'csdm/node/database/database';
import { deleteCameraPreviewFile } from 'csdm/node/filesystem/cameras/delete-camera-preview-file';
export async function deleteCamera(cameraId) {
    await db.deleteFrom('cameras').where('id', '=', cameraId).execute();
    await deleteCameraPreviewFile(cameraId);
}
//# sourceMappingURL=delete-camera.js.map