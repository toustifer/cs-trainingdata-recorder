import { watchPlayerHighlights } from 'csdm/node/counter-strike/launcher/watch-player-highlights';
import { handleWatchDemoError, onGameStart } from 'csdm/server/counter-strike';
export async function watchPlayerHighlightsHandler(payload) {
    try {
        await watchPlayerHighlights({
            ...payload,
            onGameStart,
        });
    }
    catch (error) {
        return handleWatchDemoError(error, payload.demoPath, 'Error watching player highlights');
    }
}
//# sourceMappingURL=watch-player-highlights-handler.js.map