import { handleCounterStrikeError } from 'csdm/server/counter-strike';
import { startCounterStrike, } from 'csdm/node/counter-strike/launcher/start-counter-strike';
export async function startCounterStrikeHandler(payload) {
    try {
        await startCounterStrike(payload);
    }
    catch (error) {
        return handleCounterStrikeError(error);
    }
}
//# sourceMappingURL=start-counter-strike-handler.js.map