import { useEffect } from 'react';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { pauseQueue, resumeQueue, videoAddedToQueue, videoUpdated, videosRemovedFromQueue, } from 'csdm/ui/videos/videos-actions';
export function useRegisterVideoQueueListeners(client) {
    const dispatch = useDispatch();
    useEffect(() => {
        const onVideoAddedToQueue = (video) => {
            dispatch(videoAddedToQueue(video));
        };
        client.on(RendererServerMessageName.VideoAddedToQueue, onVideoAddedToQueue);
        const onVideosRemovedFromQueue = (videoIds) => {
            dispatch(videosRemovedFromQueue(videoIds));
        };
        client.on(RendererServerMessageName.VideosRemovedFromQueue, onVideosRemovedFromQueue);
        const onVideoUpdated = (video) => {
            dispatch(videoUpdated(video));
        };
        client.on(RendererServerMessageName.VideoUpdated, onVideoUpdated);
        const onResume = () => {
            dispatch(resumeQueue());
        };
        client.on(RendererServerMessageName.VideoQueueResumed, onResume);
        const onPause = () => {
            dispatch(pauseQueue());
        };
        client.on(RendererServerMessageName.VideoQueuePaused, onPause);
        return () => {
            client.off(RendererServerMessageName.VideoAddedToQueue, onVideoAddedToQueue);
            client.off(RendererServerMessageName.VideosRemovedFromQueue, onVideosRemovedFromQueue);
            client.off(RendererServerMessageName.VideoUpdated, onVideoUpdated);
            client.off(RendererServerMessageName.VideoQueueResumed, onResume);
            client.off(RendererServerMessageName.VideoQueuePaused, onPause);
        };
    });
}
//# sourceMappingURL=use-register-video-queue-listeners.js.map