import { watchPlayerRounds } from 'csdm/node/counter-strike/launcher/watch-player-rounds';
import { handleWatchDemoError, onGameStart } from 'csdm/server/counter-strike';
export async function watchPlayerRoundsHandler(payload) {
    try {
        await watchPlayerRounds({
            ...payload,
            onGameStart,
        });
    }
    catch (error) {
        return handleWatchDemoError(error, payload.demoPath, 'Error watching player rounds');
    }
}
//# sourceMappingURL=watch-player-rounds-handler.js.map