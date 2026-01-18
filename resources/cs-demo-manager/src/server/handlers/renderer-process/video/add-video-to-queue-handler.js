import { assertVideoGenerationIsPossible } from 'csdm/node/video/generation/assert-video-generation-is-possible';
import { videoQueue } from 'csdm/server/video-queue';
import { handleError } from '../../handle-error';
export async function addVideoToQueueHandler(payload) {
    try {
        await assertVideoGenerationIsPossible(payload);
        videoQueue.addVideo(payload);
    }
    catch (error) {
        handleError(error, 'Error while adding video to queue');
    }
}
//# sourceMappingURL=add-video-to-queue-handler.js.map