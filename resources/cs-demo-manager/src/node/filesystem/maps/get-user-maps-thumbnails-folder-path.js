import path from 'node:path';
import { getUserMapsImagesFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-images-folder-path';
export function getUserMapsThumbnailsFolderPath(game) {
    const userMapsImagesFolderPath = getUserMapsImagesFolderPath(game);
    return path.join(userMapsImagesFolderPath, 'thumbnails');
}
//# sourceMappingURL=get-user-maps-thumbnails-folder-path.js.map