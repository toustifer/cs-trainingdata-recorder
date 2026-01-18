import path from 'node:path';
import fs from 'node:fs/promises';
import { getUserMapsRadarsFolderPath } from 'csdm/node/filesystem/maps/get-user-maps-radars-folder-path';
export async function writeMapRadarFileFromBase64(mapName, game, base64) {
    const radarsFolderPath = getUserMapsRadarsFolderPath(game);
    const radarPath = path.join(radarsFolderPath, `${mapName}.png`);
    await fs.writeFile(radarPath, base64.replace(/^data:image\/png;base64,/, ''), 'base64');
}
//# sourceMappingURL=write-map-radar-image-from-base64.js.map