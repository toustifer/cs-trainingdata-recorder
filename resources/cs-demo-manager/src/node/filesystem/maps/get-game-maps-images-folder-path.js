import path from 'node:path';
import { Game } from 'csdm/common/types/counter-strike';
import { getMapsImagesFolderPath } from './get-maps-images-folder-path';
export function getGameMapsImagesFolderPath(game) {
    const imagesFolderPath = getMapsImagesFolderPath();
    const gameFolder = game === Game.CSGO ? 'csgo' : 'cs2';
    return path.join(imagesFolderPath, gameFolder);
}
//# sourceMappingURL=get-game-maps-images-folder-path.js.map