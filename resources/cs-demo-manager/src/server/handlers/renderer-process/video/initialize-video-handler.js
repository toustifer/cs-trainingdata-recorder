import { isHlaeUpdateAvailable } from 'csdm/node/video/hlae/is-hlae-update-available';
import { getInstalledFfmpegVersion } from 'csdm/node/video/ffmpeg/get-installed-ffmpeg-version';
import { getInstalledVirtualDubVersion } from 'csdm/node/video/virtual-dub/get-installed-virtual-dub-version';
import { getInstalledHlaeVersion } from 'csdm/node/video/hlae/get-installed-hlae-version';
import { isWindows } from 'csdm/node/os/is-windows';
import { isFfmpegUpdateAvailable } from 'csdm/node/video/ffmpeg/is-ffmpeg-update-available';
import { getSettings } from 'csdm/node/settings/get-settings';
import { getOutputFolderPath } from 'csdm/node/video/get-output-folder-path';
import { handleError } from '../../handle-error';
export async function initializeVideoHandler({ demoFilePath }) {
    try {
        const settings = await getSettings();
        const promises = [
            getInstalledFfmpegVersion(),
            isFfmpegUpdateAvailable(),
            getOutputFolderPath(settings.video, demoFilePath),
        ];
        if (isWindows) {
            promises.push(getInstalledHlaeVersion(), isHlaeUpdateAvailable(), getInstalledVirtualDubVersion());
        }
        const [installedFfmpegVersion, ffmpegUpdateAvailable, outputFolderPath, installedHlaeVersion, hlaeUpdateAvailable, installedVirtualDubVersion,] = (await Promise.all(promises));
        const payload = {
            hlaeVersion: installedHlaeVersion,
            virtualDubVersion: installedVirtualDubVersion,
            hlaeUpdateAvailable,
            ffmpegVersion: installedFfmpegVersion,
            ffmpegUpdateAvailable,
            outputFolderPath,
        };
        return payload;
    }
    catch (error) {
        handleError(error, 'Error while initializing video');
    }
}
//# sourceMappingURL=initialize-video-handler.js.map