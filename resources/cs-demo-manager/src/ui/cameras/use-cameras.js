import { useCamerasState } from './use-cameras-state';
export function useCameras(game, mapName) {
    const state = useCamerasState();
    return state.entities.filter((camera) => camera.game === game && camera.mapName === mapName);
}
//# sourceMappingURL=use-cameras.js.map