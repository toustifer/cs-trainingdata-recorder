import path from 'node:path';
import { getAppFolderPath } from 'csdm/node/filesystem/get-app-folder-path';
export function getUserImagesFolderPath() {
    return path.join(getAppFolderPath(), 'images');
}
//# sourceMappingURL=get-user-images-folder-path.js.map