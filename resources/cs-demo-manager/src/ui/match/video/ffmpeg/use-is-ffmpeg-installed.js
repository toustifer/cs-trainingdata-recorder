import { useFfmpegState } from 'csdm/ui/match/video/ffmpeg/use-ffmpeg-state';
export function useIsFfmpegInstalled() {
    const ffmpegState = useFfmpegState();
    return ffmpegState.version !== undefined;
}
//# sourceMappingURL=use-is-ffmpeg-installed.js.map