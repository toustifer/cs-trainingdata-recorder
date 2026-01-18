import { useFfmpegState } from 'csdm/ui/match/video/ffmpeg/use-ffmpeg-state';
export function useIsFfmpegUpdateAvailable() {
    const ffmpegState = useFfmpegState();
    return ffmpegState.isUpdateAvailable;
}
//# sourceMappingURL=use-is-ffmpeg-update-available.js.map