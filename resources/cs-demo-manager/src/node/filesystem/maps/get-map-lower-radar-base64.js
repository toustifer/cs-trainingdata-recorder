import fs from 'fs-extra';
import { getMapLowerRadarFilePath } from './get-map-lower-radar-file-path';
export async function getMapLowerRadarBase64(mapName, game) {
    const filePath = await getMapLowerRadarFilePath(mapName, game);
    if (!filePath) {
        return undefined;
    }
    const fileExists = await fs.pathExists(filePath);
    if (!fileExists) {
        return undefined;
    }
    const data = await fs.readFile(filePath, 'base64');
    return `data:image/png;base64,${data}`;
}
//# sourceMappingURL=get-map-lower-radar-base64.js.map