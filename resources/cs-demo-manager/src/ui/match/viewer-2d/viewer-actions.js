import { createAction } from '@reduxjs/toolkit';
export const focusedPlayerChanged = createAction('match/viewer/focusedPlayerChanged');
export const speedChanged = createAction('match/viewer/speedChanged');
export const volumeChanged = createAction('match/viewer/volumeChanged');
export const audioLoaded = createAction('match/viewer/audioLoaded');
export const audioOffsetChanged = createAction('match/viewer/audioOffsetChanged');
export const resetAudioOffset = createAction('match/viewer/resetAudioOffset');
//# sourceMappingURL=viewer-actions.js.map