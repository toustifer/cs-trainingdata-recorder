import fs from 'fs-extra';
import { getSettingsFilePath } from './get-settings-file-path';
export async function writeSettings(settings) {
    try {
        const settingsFilePath = getSettingsFilePath();
        const json = JSON.stringify(settings, null, 2);
        await fs.outputFile(settingsFilePath, json);
    }
    catch (error) {
        logger.error('Error while writing settings');
        logger.error(error);
        throw error;
    }
}
//# sourceMappingURL=write-settings.js.map