import path from 'node:path';
import fs from 'node:fs/promises';
import { getUserMapsThumbnailsFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-thumbnails-folder-path';
export async function writeMapThumbnailFileFromBase64(mapName, game, base64) {
    const userThumbnailsFolderPath = getUserMapsThumbnailsFolderPath(game);
    const thumbnailPath = path.join(userThumbnailsFolderPath, `${mapName}.png`);
    await fs.writeFile(thumbnailPath, base64.replace(/^data:image\/png;base64,/, ''), 'base64');
}
//# sourceMappingURL=write-map-thumbnail-file.js.map