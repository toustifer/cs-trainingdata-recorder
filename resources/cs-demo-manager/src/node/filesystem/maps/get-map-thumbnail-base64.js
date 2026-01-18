import fs from 'fs-extra';
import { getMapThumbnailFilePath } from './get-map-thumbnail-file-path';
export async function getMapThumbnailBase64(mapName, game) {
    const filePath = await getMapThumbnailFilePath(mapName, game);
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
//# sourceMappingURL=get-map-thumbnail-base64.js.map