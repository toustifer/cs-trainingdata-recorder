import { createReducer } from '@reduxjs/toolkit';
import { initializeAppSuccess } from 'csdm/ui/bootstrap/bootstrap-actions';
import { addCameraSuccess, deleteCameraSuccess, updateCameraSuccess } from './cameras-actions';
function sortCamerasByName(camera1, camera2) {
    return camera1.name.localeCompare(camera2.name);
}
const initialState = {
    entities: [],
    cacheTimestamp: Date.now(),
};
export const camerasReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addCameraSuccess, (state, action) => {
        state.entities.push(action.payload.camera);
        state.entities.sort(sortCamerasByName);
    })
        .addCase(deleteCameraSuccess, (state, action) => {
        state.entities = state.entities.filter((camera) => {
            return !action.payload.cameraId.includes(camera.id);
        });
    })
        .addCase(updateCameraSuccess, (state, action) => {
        const cameraIndex = state.entities.findIndex((camera) => camera.id === action.payload.camera.id);
        if (cameraIndex > -1) {
            state.entities[cameraIndex] = action.payload.camera;
            state.cacheTimestamp = Date.now();
        }
    })
        .addCase(initializeAppSuccess, (state, action) => {
        state.entities = action.payload.cameras.sort(sortCamerasByName);
    });
});
//# sourceMappingURL=cameras-reducer.js.map