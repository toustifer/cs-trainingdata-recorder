import { useVideoState } from 'csdm/ui/match/video/use-video-state';
export function useSequencesByDemoFilePath() {
    const video = useVideoState();
    return video.sequencesByDemoFilePath;
}
//# sourceMappingURL=use-sequences-by-demo-file-path.js.map