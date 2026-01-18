import { useVideoState } from 'csdm/ui/match/video/use-video-state';
export function useFfmpegState() {
    const videoState = useVideoState();
    return videoState.ffmpeg;
}
//# sourceMappingURL=use-ffmpeg-state.js.map