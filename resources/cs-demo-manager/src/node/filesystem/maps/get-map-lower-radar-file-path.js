import path from 'node:path';
import fs from 'fs-extra';
import { getUserMapsRadarsFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-radars-folder-path';
import { getMapsRadarsFolderPath } from './get-maps-radars-folder-path';
async function getMapRadarFilePathInAppFolder(mapName, game) {
    const radarsFolderPath = getMapsRadarsFolderPath(game);
    const radarFilePath = path.join(radarsFolderPath, `${mapName}_lower.png`);
    const radarFileExists = await fs.pathExists(radarFilePath);
    return radarFileExists ? radarFilePath : undefined;
}
async function getMapRadarFilePathInUserFolder(mapName, game) {
    const radarsFolderPath = getUserMapsRadarsFolderPath(game);
    const radarFilePath = path.join(radarsFolderPath, `${mapName}_lower.png`);
    const radarFileExists = await fs.pathExists(radarFilePath);
    return radarFileExists ? radarFilePath : undefined;
}
export async function getMapLowerRadarFilePath(mapName, game) {
    const radarFilePathInUserFolder = await getMapRadarFilePathInUserFolder(mapName, game);
    if (radarFilePathInUserFolder) {
        return radarFilePathInUserFolder;
    }
    const radarFilePathInAppFolder = await getMapRadarFilePathInAppFolder(mapName, game);
    return radarFilePathInAppFolder;
}
//# sourceMappingURL=get-map-lower-radar-file-path.js.map