import { useFfmpegState } from './use-ffmpeg-state';
export function useInstalledFfmpegVersion() {
    const ffmpegState = useFfmpegState();
    return ffmpegState.version;
}
//# sourceMappingURL=use-installed-ffmpeg-version.js.map