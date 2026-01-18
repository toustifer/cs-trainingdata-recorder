import fs from 'fs-extra';
import { getHlaeVersionFromExecutable } from 'csdm/node/video/hlae/get-hlae-version-from-executable';
import { updateSettingsAndNotifyRendererProcess } from 'csdm/server/update-settings-and-notify-renderer-process';
import { FileNotFound } from 'csdm/node/filesystem/errors/file-not-found';
import { checkForHlaeUpdate } from 'csdm/node/video/hlae/check-for-hlae-update';
import { handleError } from '../../handle-error';
export async function enableHlaeCustomLocationHandler(customExecutablePath) {
    try {
        const executableExists = await fs.pathExists(customExecutablePath);
        if (!executableExists) {
            throw new FileNotFound(customExecutablePath);
        }
        const version = await getHlaeVersionFromExecutable(customExecutablePath);
        const hlaeSettings = {
            customLocationEnabled: true,
            customExecutableLocation: customExecutablePath,
        };
        await updateSettingsAndNotifyRendererProcess({
            video: {
                hlae: hlaeSettings,
            },
        });
        let isUpdateAvailable = false;
        if (version !== undefined) {
            isUpdateAvailable = await checkForHlaeUpdate(version);
        }
        const payload = {
            version,
            isUpdateAvailable,
            errorCode: undefined,
        };
        return payload;
    }
    catch (error) {
        handleError(error, 'Error while enabling HLAE custom location');
    }
}
//# sourceMappingURL=enable-hlae-custom-location-handler.js.map