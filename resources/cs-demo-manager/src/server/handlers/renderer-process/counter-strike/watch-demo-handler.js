import { watchDemo } from 'csdm/node/counter-strike/launcher/watch-demo';
import { handleWatchDemoError, onGameStart } from 'csdm/server/counter-strike';
export async function watchDemoHandler(payload) {
    try {
        await watchDemo({
            ...payload,
            onGameStart,
        });
    }
    catch (error) {
        return handleWatchDemoError(error, payload.demoPath, 'Error watching demo');
    }
}
//# sourceMappingURL=watch-demo-handler.js.map