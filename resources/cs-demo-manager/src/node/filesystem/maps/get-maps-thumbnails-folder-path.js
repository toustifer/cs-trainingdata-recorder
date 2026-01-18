import path from 'node:path';
import { getGameMapsImagesFolderPath } from './get-game-maps-images-folder-path';
export function getMapsThumbnailsFolderPath(game) {
    const mapsImagesFolderPath = getGameMapsImagesFolderPath(game);
    return path.join(mapsImagesFolderPath, 'thumbnails');
}
//# sourceMappingURL=get-maps-thumbnails-folder-path.js.map