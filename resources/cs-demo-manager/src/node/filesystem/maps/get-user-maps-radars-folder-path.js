import path from 'node:path';
import { getUserMapsImagesFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-images-folder-path';
export function getUserMapsRadarsFolderPath(game) {
    const userMapsImagesFolderPath = getUserMapsImagesFolderPath(game);
    return path.join(userMapsImagesFolderPath, 'radars');
}
//# sourceMappingURL=get-user-maps-radars-folder-path.js.map