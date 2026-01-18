import { useVideoState } from 'csdm/ui/match/video/use-video-state';
export function useHlaeState() {
    const video = useVideoState();
    return video.hlae;
}
//# sourceMappingURL=use-hlae-state.js.map