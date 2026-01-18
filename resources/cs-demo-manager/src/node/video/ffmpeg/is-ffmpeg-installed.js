import fs from 'fs-extra';
import { getFfmpegExecutablePath } from './ffmpeg-location';
export async function isFfmpegInstalled() {
    const ffmpegExecutablePath = await getFfmpegExecutablePath();
    const ffmpegExecutableExists = await fs.pathExists(ffmpegExecutablePath);
    return ffmpegExecutableExists;
}
//# sourceMappingURL=is-ffmpeg-installed.js.map