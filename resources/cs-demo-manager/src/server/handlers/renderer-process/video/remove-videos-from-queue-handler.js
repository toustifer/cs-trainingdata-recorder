import { videoQueue } from 'csdm/server/video-queue';
export async function removeVideosFromQueueHandler(videoIds) {
    videoQueue.removeVideos(videoIds);
    return Promise.resolve();
}
//# sourceMappingURL=remove-videos-from-queue-handler.js.map