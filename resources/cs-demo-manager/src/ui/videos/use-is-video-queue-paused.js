import { useVideosState } from './use-videos-state';
export function useVideoQueuePaused() {
    const state = useVideosState();
    return state.isPaused;
}
//# sourceMappingURL=use-is-video-queue-paused.js.map