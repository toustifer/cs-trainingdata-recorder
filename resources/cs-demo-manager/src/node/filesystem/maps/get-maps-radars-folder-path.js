import path from 'node:path';
import { getGameMapsImagesFolderPath } from './get-game-maps-images-folder-path';
export function getMapsRadarsFolderPath(game) {
    const mapsImagesFolderPath = getGameMapsImagesFolderPath(game);
    return path.join(mapsImagesFolderPath, 'radars');
}
//# sourceMappingURL=get-maps-radars-folder-path.js.map