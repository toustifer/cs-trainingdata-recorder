import { createReducer } from '@reduxjs/toolkit';
import { initializeVideoSuccess } from 'csdm/ui/match/video/video-actions';
import { installVirtualDubSuccess } from './virtual-dub-actions';
const initialState = {
    version: undefined,
};
export const virtualDubReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(installVirtualDubSuccess, (state, action) => {
        state.version = action.payload.version;
    })
        .addCase(initializeVideoSuccess, (state, action) => {
        state.version = action.payload.virtualDubVersion;
    });
});
//# sourceMappingURL=virtual-dub-reducer.js.map