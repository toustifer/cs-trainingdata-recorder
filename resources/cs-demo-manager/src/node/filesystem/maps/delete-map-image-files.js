import path from 'node:path';
import fs from 'fs-extra';
import { getUserMapsRadarsFolderPath } from './get-user-maps-radars-folder-path';
import { getUserMapsThumbnailsFolderPath } from './get-user-maps-thumbnails-folder-path';
export async function deleteMapImageFiles(map) {
    const thumbnailsFolderPath = getUserMapsThumbnailsFolderPath(map.game);
    const thumbnailPath = path.join(thumbnailsFolderPath, `${map.name}.png`);
    const mapsRadarsFolderPath = getUserMapsRadarsFolderPath(map.game);
    const radarPath = path.join(mapsRadarsFolderPath, `${map.name}.png`);
    const lowerRadarPath = path.join(mapsRadarsFolderPath, `${map.name}_lower.png`);
    await Promise.all([fs.remove(thumbnailPath), fs.remove(radarPath), fs.remove(lowerRadarPath)]);
}
//# sourceMappingURL=delete-map-image-files.js.map