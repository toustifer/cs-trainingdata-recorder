import { ErrorCode } from 'csdm/common/error-code';
import { getErrorCodeFromError } from 'csdm/server/get-error-code-from-error';
import { isValidGame } from 'csdm/common/types/is-valid-game';
import { server } from 'csdm/server/server';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { sleep } from 'csdm/common/sleep';
import { CounterStrikeNotConnected } from 'csdm/node/counter-strike/launcher/errors/counter-strike-not-connected';
import { CounterStrikeNoResponse } from 'csdm/node/counter-strike/launcher/errors/counter-strike-no-response';
export function onGameStart() {
    server.sendMessageToRendererProcess({
        name: RendererServerMessageName.StartingCounterStrike,
    });
}
function buildCounterStrikeErrorPayload(error, message) {
    const errorCode = getErrorCodeFromError(error);
    if (errorCode === ErrorCode.UnknownError) {
        logger.error(message);
        logger.error(error);
    }
    let game;
    if (error && typeof error === 'object' && 'game' in error && isValidGame(error.game)) {
        game = error.game;
    }
    const payload = {
        errorCode,
        game,
    };
    return payload;
}
export function handleCounterStrikeError(error) {
    const payload = buildCounterStrikeErrorPayload(error, 'Error starting Counter-Strike');
    server.sendMessageToRendererProcess({
        name: RendererServerMessageName.CounterStrikeError,
        payload,
    });
    return payload;
}
export function handleWatchDemoError(error, demoPath, message) {
    const payload = {
        ...buildCounterStrikeErrorPayload(error, message),
        demoPath,
    };
    server.sendMessageToRendererProcess({
        name: RendererServerMessageName.CounterStrikeError,
        payload,
    });
    return payload;
}
export async function sendMessageToGame({ message, responseMessageName, onResponse, }) {
    if (!server.isGameConnected()) {
        throw new CounterStrikeNotConnected();
    }
    let hasReceivedMessage = false;
    const handleResponse = (data) => {
        hasReceivedMessage = true;
        onResponse?.(data);
    };
    server.addGameMessageListener(responseMessageName, handleResponse);
    server.sendMessageToGameProcess(message);
    await sleep(2000);
    server.removeGameEventListeners(responseMessageName);
    if (hasReceivedMessage) {
        return;
    }
    logger.warn('CS is connected but we did not receive a response from it.');
    throw new CounterStrikeNoResponse();
}
//# sourceMappingURL=counter-strike.js.map