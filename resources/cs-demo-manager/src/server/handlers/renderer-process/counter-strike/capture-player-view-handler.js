import { capturePlayerView } from 'csdm/node/counter-strike/launcher/capture-player-view';
import { handleError } from '../../handle-error';
export async function capturePlayerViewHandler(game) {
    try {
        return await capturePlayerView(game);
    }
    catch (error) {
        return handleError(error, 'Error while capturing player view');
    }
}
//# sourceMappingURL=capture-player-view-handler.js.map