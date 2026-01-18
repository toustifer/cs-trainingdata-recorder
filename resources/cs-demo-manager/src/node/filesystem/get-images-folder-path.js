import path from 'node:path';
import { getStaticFolderPath } from './get-static-folder-path';
export function getImagesFolderPath() {
    return path.join(getStaticFolderPath(), 'images');
}
//# sourceMappingURL=get-images-folder-path.js.map