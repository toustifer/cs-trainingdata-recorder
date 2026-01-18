import path from 'node:path';
import fs from 'node:fs/promises';
import { getUserMapsRadarsFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-radars-folder-path';
export async function writeMapLowerRadarFileFromBase64(mapName, game, base64) {
    const radarsFolderPath = getUserMapsRadarsFolderPath(game);
    const lowerRadarPath = path.join(radarsFolderPath, `${mapName}_lower.png`);
    await fs.writeFile(lowerRadarPath, base64.replace(/^data:image\/png;base64,/, ''), 'base64');
}
//# sourceMappingURL=write-map-lower-radar-file-from-base64.js.map