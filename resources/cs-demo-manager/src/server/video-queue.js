import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { server } from './server';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { getErrorCodeFromError } from './get-error-code-from-error';
import { ErrorCode } from 'csdm/common/error-code';
import { VideoStatus } from 'csdm/common/types/video-status';
import { generateVideo } from 'csdm/node/video/generation/generate-video';
import { AbortError } from 'csdm/node/errors/abort-error';
import { CommandError } from 'csdm/node/video/errors/command-error';
class VideoQueue {
    videos = [];
    currentVideo;
    abortControllers = {};
    isPaused = true;
    resume() {
        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;
        this.loopUntilRecodingDone();
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.VideoQueueResumed,
        });
    }
    pause() {
        this.isPaused = true;
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.VideoQueuePaused,
        });
    }
    removeVideos(ids) {
        for (const id of ids) {
            this.abortVideo(id);
        }
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.VideosRemovedFromQueue,
            payload: ids,
        });
    }
    addVideo(partialVideo) {
        const isUpdate = partialVideo.id;
        const id = partialVideo.id ?? randomUUID();
        const date = partialVideo.date ?? new Date().toISOString();
        const video = {
            ...partialVideo,
            id,
            date,
            status: VideoStatus.Pending,
            output: '',
            errorCode: undefined,
            // Raw files and output files are stored in a folder named after the video id to avoid overwriting files
            outputFolderPath: isUpdate ? partialVideo.outputFolderPath : path.join(partialVideo.outputFolderPath, id),
        };
        this.videos.push(video);
        this.abortControllers[id] = new AbortController();
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.VideoAddedToQueue,
            payload: video,
        });
        if (!this.isPaused) {
            this.loopUntilRecodingDone();
        }
    }
    abortVideo(id) {
        const abortController = this.abortControllers[id];
        if (abortController) {
            abortController.abort();
            delete this.abortControllers[id];
        }
        if (this.currentVideo?.id === id) {
            this.currentVideo = undefined;
        }
        this.videos = this.videos.filter((video) => video.id !== id);
    }
    getVideos = () => {
        if (this.currentVideo) {
            return [...this.videos, this.currentVideo];
        }
        return this.videos;
    };
    async loopUntilRecodingDone() {
        if (this.currentVideo) {
            return;
        }
        this.currentVideo = this.videos.shift();
        while (this.currentVideo) {
            await this.processVideo(this.currentVideo);
            if (this.isPaused) {
                this.currentVideo = undefined;
                break;
            }
            this.currentVideo = this.videos.shift();
        }
    }
    processVideo = async (video) => {
        try {
            this.updateCurrentVideoAnNotifyRendererProcess({ status: VideoStatus.Recording });
            const ctrl = new AbortController();
            this.abortControllers[video.id] = ctrl;
            await generateVideo({
                ...video,
                videoId: video.id,
                signal: ctrl.signal,
                onGameStart: () => {
                    this.updateCurrentVideoAnNotifyRendererProcess({ status: VideoStatus.Recording });
                },
                onMoveFilesStart: () => {
                    this.updateCurrentVideoAnNotifyRendererProcess({ status: VideoStatus.MovingFiles });
                },
                onSequenceStart: (sequenceNumber) => {
                    this.updateCurrentVideoAnNotifyRendererProcess({
                        status: VideoStatus.Converting,
                        currentSequence: sequenceNumber,
                    });
                },
                onConcatenateSequencesStart: () => {
                    this.updateCurrentVideoAnNotifyRendererProcess({ status: VideoStatus.Concatenating });
                },
            });
            this.updateCurrentVideoAnNotifyRendererProcess({ status: VideoStatus.Success });
            delete this.abortControllers[video.id];
        }
        catch (error) {
            if (error instanceof AbortError) {
                this.abortVideo(video.id);
            }
            else {
                const errorCode = getErrorCodeFromError(error);
                if (errorCode === ErrorCode.UnknownError) {
                    logger.error('Error while generating video');
                    logger.error(error);
                }
                let output;
                if (error instanceof CommandError) {
                    output = error.output;
                }
                else if (error instanceof Error) {
                    output = error.message;
                }
                this.updateCurrentVideoAnNotifyRendererProcess({
                    status: VideoStatus.Error,
                    output,
                    errorCode,
                });
            }
        }
        finally {
            delete this.abortControllers[video.id];
        }
    };
    updateCurrentVideoAnNotifyRendererProcess = (video) => {
        if (!this.currentVideo) {
            return;
        }
        this.currentVideo = {
            ...this.currentVideo,
            ...video,
        };
        server.sendMessageToRendererProcess({
            name: RendererServerMessageName.VideoUpdated,
            payload: this.currentVideo,
        });
    };
}
export const videoQueue = new VideoQueue();
//# sourceMappingURL=video-queue.js.map