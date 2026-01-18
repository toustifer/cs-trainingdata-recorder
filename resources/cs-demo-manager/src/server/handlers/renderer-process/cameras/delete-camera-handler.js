import { handleError } from '../../handle-error';
import { deleteCamera } from 'csdm/node/database/cameras/delete-camera';
export async function deleteCameraHandler(cameraId) {
    try {
        await deleteCamera(cameraId);
    }
    catch (error) {
        handleError(error, 'Error while deleting camera');
    }
}
//# sourceMappingURL=delete-camera-handler.js.map