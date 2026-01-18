import { watchPlayerLowlights } from 'csdm/node/counter-strike/launcher/watch-player-lowlights';
import { handleWatchDemoError, onGameStart } from 'csdm/server/counter-strike';
export async function watchPlayerLowlightsHandler(payload) {
    try {
        await watchPlayerLowlights({
            ...payload,
            onGameStart,
        });
    }
    catch (error) {
        return handleWatchDemoError(error, payload.demoPath, 'Error watching player lowlights');
    }
}
//# sourceMappingURL=watch-player-lowlights-handler.js.map