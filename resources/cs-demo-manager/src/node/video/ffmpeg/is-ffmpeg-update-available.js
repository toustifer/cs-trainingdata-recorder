import { checkForFfmpegUpdate } from 'csdm/node/video/ffmpeg/check-for-ffmpeg-update';
import { getInstalledFfmpegVersion } from 'csdm/node/video/ffmpeg/get-installed-ffmpeg-version';
export async function isFfmpegUpdateAvailable() {
    const installedVersion = await getInstalledFfmpegVersion();
    if (installedVersion === undefined || installedVersion === '?') {
        return false;
    }
    const isUpdateAvailable = await checkForFfmpegUpdate(installedVersion);
    return isUpdateAvailable;
}
//# sourceMappingURL=is-ffmpeg-update-available.js.map