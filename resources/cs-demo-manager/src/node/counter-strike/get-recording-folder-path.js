import path from 'node:path';
import { Game } from 'csdm/common/types/counter-strike';
import { getCsgoFolderPathOrThrow } from './get-csgo-folder-path';
export async function getRecordingFolderPath(game) {
    const isCsgo = game === Game.CSGO;
    const csgoFolderPath = await getCsgoFolderPathOrThrow(game);
    let recordingFolderPath;
    if (isCsgo) {
        recordingFolderPath = path.join(csgoFolderPath, 'csgo');
    }
    else {
        // The "movie" folder is inside our plugin folder
        recordingFolderPath = path.join(csgoFolderPath, 'game', 'csgo', 'csdm', 'movie');
    }
    return recordingFolderPath;
}
//# sourceMappingURL=get-recording-folder-path.js.map