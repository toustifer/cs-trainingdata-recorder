import path from 'node:path';
import fs from 'fs-extra';
import { getUserMapsThumbnailsFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-thumbnails-folder-path';
import { getMapsThumbnailsFolderPath } from 'csdm/node/filesystem/maps/get-maps-thumbnails-folder-path';
async function getMapThumbnailFilePathInAppFolder(mapName, game) {
    const thumbnailsFolderPath = getMapsThumbnailsFolderPath(game);
    const thumbnailFilePath = path.join(thumbnailsFolderPath, `${mapName}.png`);
    const thumbnailFileExists = await fs.pathExists(thumbnailFilePath);
    return thumbnailFileExists ? thumbnailFilePath : undefined;
}
async function getMapThumbnailFilePathInUserFolder(mapName, game) {
    const thumbnailsFolderPath = getUserMapsThumbnailsFolderPath(game);
    const thumbnailFilePath = path.join(thumbnailsFolderPath, `${mapName}.png`);
    const thumbnailFileExists = await fs.pathExists(thumbnailFilePath);
    return thumbnailFileExists ? thumbnailFilePath : undefined;
}
export async function getMapThumbnailFilePath(mapName, game) {
    const thumbnailFilePathInUserFolder = await getMapThumbnailFilePathInUserFolder(mapName, game);
    if (thumbnailFilePathInUserFolder) {
        return thumbnailFilePathInUserFolder;
    }
    const thumbnailPathInAppFolder = await getMapThumbnailFilePathInAppFolder(mapName, game);
    if (thumbnailPathInAppFolder) {
        return thumbnailPathInAppFolder;
    }
    return undefined;
}
//# sourceMappingURL=get-map-thumbnail-file-path.js.map