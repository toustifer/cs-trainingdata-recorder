import fs from 'fs-extra';
import path from 'node:path';
import { updateSettings } from 'csdm/node/settings/update-settings';
export async function getOutputFolderPath(settings, demoFilePath) {
    const currentOutputFolderPath = settings.outputFolderPath;
    let outputFolderPath = currentOutputFolderPath;
    const currentOutputFolderExists = await fs.pathExists(currentOutputFolderPath);
    if (currentOutputFolderPath === '' || !currentOutputFolderExists) {
        outputFolderPath = path.dirname(demoFilePath);
        await updateSettings({
            video: {
                outputFolderPath,
            },
        });
    }
    return outputFolderPath;
}
//# sourceMappingURL=get-output-folder-path.js.map