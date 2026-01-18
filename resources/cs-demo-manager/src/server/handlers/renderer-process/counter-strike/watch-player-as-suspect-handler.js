import { watchPlayerAsSuspect } from 'csdm/node/counter-strike/launcher/watch-player-as-suspect';
import { handleWatchDemoError, onGameStart } from 'csdm/server/counter-strike';
export async function watchPlayerAsSuspectHandler(payload) {
    try {
        await watchPlayerAsSuspect({
            ...payload,
            onGameStart,
        });
    }
    catch (error) {
        return handleWatchDemoError(error, payload.demoPath, 'Error watching player as suspect');
    }
}
//# sourceMappingURL=watch-player-as-suspect-handler.js.map