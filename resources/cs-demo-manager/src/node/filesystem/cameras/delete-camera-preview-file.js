import fs from 'fs-extra';
import { getCameraPreviewImagePath } from './get-camera-preview-image-path';
export async function deleteCameraPreviewFile(cameraId) {
    const cameraPreviewImagePath = await getCameraPreviewImagePath(cameraId);
    if (cameraPreviewImagePath) {
        await fs.remove(cameraPreviewImagePath);
    }
}
//# sourceMappingURL=delete-camera-preview-file.js.map