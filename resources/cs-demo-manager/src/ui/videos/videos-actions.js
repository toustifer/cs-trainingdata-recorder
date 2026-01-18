import { createAction } from '@reduxjs/toolkit';
export const videoAddedToQueue = createAction('videos/added');
export const videosRemovedFromQueue = createAction('videos/removed');
export const videoUpdated = createAction('videos/updated');
export const removeCompletedVideos = createAction('videos/removeCompleted');
export const resumeQueue = createAction('videos/resume');
export const pauseQueue = createAction('videos/pause');
//# sourceMappingURL=videos-actions.js.map