import path from 'node:path';
import { getUserImagesFolderPath } from '../get-user-images-folder-path';
export function getUserCamerasFolderPath() {
    const imagesFolderPath = getUserImagesFolderPath();
    return path.join(imagesFolderPath, 'cameras');
}
//# sourceMappingURL=get-user-cameras-folder-path.js.map