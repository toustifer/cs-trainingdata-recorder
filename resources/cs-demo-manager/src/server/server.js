process.env.PROCESS_NAME = 'server';
import '../common/install-source-map-support';
import 'csdm/node/logger';
import { WebSocketServer as WSServer } from 'ws';
import { URL } from 'node:url';
import { rendererHandlers } from 'csdm/server/handlers/renderer-handlers-mapping';
import { mainHandlers } from 'csdm/server/handlers/main-handlers-mapping';
import { WEB_SOCKET_SERVER_PORT } from './port';
import { SharedServerMessageName } from './shared-server-message-name';
import { ErrorCode } from '../common/error-code';
import { NetworkError } from '../node/errors/network-error';
process.on('uncaughtException', logger.error);
process.on('unhandledRejection', logger.error);
class WebSocketServer {
    server;
    rendererProcessSocket = null;
    mainProcessSocket = null;
    gameProcessSocket = null;
    gameListeners = new Map();
    constructor() {
        this.server = new WSServer({
            port: WEB_SOCKET_SERVER_PORT,
        });
        this.server.on('listening', this.onServerCreated);
        this.server.on('connection', this.onConnection);
        this.server.on('error', this.onError);
        this.server.on('close', this.onClose);
    }
    sendMessageToRendererProcess = (message) => {
        if (this.rendererProcessSocket) {
            this.rendererProcessSocket.send(JSON.stringify(message));
        }
        else {
            logger.warn(`WS:: rendererProcessSocket is null, can't send message to renderer process`);
        }
    };
    sendMessageToMainProcess = (message) => {
        if (this.mainProcessSocket) {
            this.mainProcessSocket.send(JSON.stringify(message));
        }
        else {
            logger.warn(`WS:: mainProcessSocket is null, can't send message to main process`);
        }
    };
    sendMessageToGameProcess = (message) => {
        if (this.gameProcessSocket) {
            this.gameProcessSocket.send(JSON.stringify(message));
        }
        else {
            logger.warn(`WS:: gameProcessSocket is null, can't send message to game process`);
        }
    };
    broadcast = (message) => {
        for (const client of this.server.clients) {
            client.send(JSON.stringify(message));
        }
    };
    onServerCreated = () => {
        logger.debug(`WS:: server listening on port ${WEB_SOCKET_SERVER_PORT}`);
    };
    onConnection = (webSocket, request) => {
        if (request.url === undefined) {
            logger.error('WS:: Missing request URL');
            return;
        }
        // Prepend http://localhost to construct a valid URL and parse the query parameters.
        const url = new URL(`http://localhost${request.url}`);
        const processName = url.searchParams.get('process');
        if (processName === 'main') {
            logger.debug(`WS:: main process socket connected`);
            this.mainProcessSocket = webSocket;
            this.mainProcessSocket.on('close', this.onMainProcessSocketDisconnect);
            this.mainProcessSocket.on('error', this.onMainProcessSocketError);
            this.mainProcessSocket.on('message', this.onMainProcessSocketMessage);
        }
        else if (processName === 'renderer') {
            logger.debug(`WS:: renderer process socket connected`);
            this.rendererProcessSocket = webSocket;
            this.rendererProcessSocket.on('close', this.onRendererProcessSocketDisconnect);
            this.rendererProcessSocket.on('error', this.onRendererProcessSocketError);
            this.rendererProcessSocket.on('message', this.onRendererProcessSocketMessage);
        }
        else {
            logger.debug(`WS:: game process socket connected`);
            this.gameProcessSocket = webSocket;
            this.gameProcessSocket.on('close', this.onGameProcessSocketDisconnect);
            this.gameProcessSocket.on('error', this.onGameProcessSocketError);
            this.gameProcessSocket.on('message', this.onGameProcessSocketMessage);
        }
    };
    onRendererProcessSocketMessage = async (data) => {
        if (this.rendererProcessSocket === null) {
            logger.warn('WS:: renderer process socket not defined');
            return;
        }
        try {
            const message = JSON.parse(data.toString());
            const { name, payload, uuid } = message;
            logger.log(`WS:: message with name ${name} and uuid ${uuid} received from renderer process`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handler = rendererHandlers[name];
            if (typeof handler === 'function') {
                try {
                    const result = await handler(payload);
                    this.sendMessageToRendererProcess({
                        name: SharedServerMessageName.Reply,
                        payload: result,
                        uuid,
                    });
                }
                catch (error) {
                    let payload = ErrorCode.UnknownError;
                    if (typeof error === 'string') {
                        payload = error;
                    }
                    else if (typeof error === 'number') {
                        payload = error;
                    }
                    if (typeof payload === 'string' || payload === ErrorCode.UnknownError) {
                        logger.error(`WS:: error handling message with ${name} from renderer process`);
                        logger.error(error);
                    }
                    this.sendMessageToRendererProcess({
                        name: SharedServerMessageName.ReplyError,
                        payload,
                        uuid,
                    });
                }
            }
            else {
                logger.warn(`WS:: unknown message name: ${name}`);
            }
        }
        catch (error) {
            logger.error('WS:: renderer process request error');
            logger.error(error);
        }
    };
    onMainProcessSocketMessage = async (data) => {
        if (this.mainProcessSocket === null) {
            logger.error('WS:: main process socket not defined');
            return;
        }
        try {
            const message = JSON.parse(data.toString());
            const { name, payload, uuid } = message;
            logger.log(`WS:: message with name ${name} and uuid ${uuid} received from main process`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const handler = mainHandlers[name];
            if (typeof handler === 'function') {
                try {
                    const result = await handler(payload);
                    this.sendMessageToMainProcess({
                        name: SharedServerMessageName.Reply,
                        payload: result,
                        uuid,
                    });
                }
                catch (error) {
                    let payload = ErrorCode.UnknownError;
                    if (typeof error === 'string') {
                        payload = error;
                    }
                    else if (typeof error === 'number') {
                        payload = error;
                    }
                    if (typeof payload === 'string' || payload === ErrorCode.UnknownError) {
                        logger.error(`WS:: error handling message with ${name} from main process`);
                        logger.error(error);
                    }
                    this.sendMessageToMainProcess({
                        name: SharedServerMessageName.ReplyError,
                        payload,
                        uuid,
                    });
                }
            }
            else {
                logger.warn(`WS:: unknown message with name: ${name}`);
            }
        }
        catch (error) {
            logger.error('WS:: main process request error');
            logger.error(error);
        }
    };
    onRendererProcessSocketDisconnect = (code, reason) => {
        logger.log('WS:: renderer process socket disconnected', code, reason);
        this.rendererProcessSocket = null;
    };
    onRendererProcessSocketError(error) {
        logger.error('WS:: renderer process socket error', error);
    }
    onMainProcessSocketError(error) {
        logger.error('WS:: main process socket error', error);
    }
    onMainProcessSocketDisconnect = (code, reason) => {
        logger.log('WS:: main process socket disconnected', code, reason);
        this.mainProcessSocket = null;
    };
    addGameMessageListener = (name, listener) => {
        const listeners = this.gameListeners.get(name);
        if (listeners === undefined) {
            this.gameListeners.set(name, [listener]);
        }
        else {
            listeners.push(listener);
        }
    };
    isGameConnected = () => {
        return this.gameProcessSocket !== null;
    };
    removeGameEventListeners = (name) => {
        this.gameListeners.set(name, []);
    };
    onGameProcessSocketMessage = (data) => {
        try {
            const message = JSON.parse(data.toString());
            const { name, payload } = message;
            logger.debug(`WS:: message with name ${name} received from game process`);
            const listeners = this.gameListeners.get(name);
            if (listeners) {
                for (const listener of listeners) {
                    listener(payload);
                }
            }
        }
        catch (error) {
            logger.error('WS:: game process request error');
            logger.error(error);
        }
    };
    onGameProcessSocketDisconnect = (code, reason) => {
        logger.debug('WS:: game process socket disconnected', code, reason);
        this.gameProcessSocket = null;
        this.gameListeners.clear();
    };
    onGameProcessSocketError(error) {
        logger.error('WS:: game process socket error', error);
    }
    onError = (error) => {
        // Ignore port already in use errors in CLI, it means the GUI is running and so the WS server too.
        if ('code' in error && error.code === 'EADDRINUSE') {
            return;
        }
        logger.error('WS:: an error occurred');
        logger.error(error);
    };
    onClose = () => {
        logger.error('WS:: server closed');
    };
}
// In dev mode (when the WS server is started from the dev window), the DOM fetch API overrides the NodeJS fetch API.
// It allows to see requests in the DevTools only during development.
// ! Sometimes you may have to use explicitly undici (NodeJS fetch) because of differences between DOM/NodeJS APIs.
// ! In this case, you will not see requests from the DevTools.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
    try {
        return await originalFetch(input, init);
    }
    catch (error) {
        // When a network issue occurred when calling fetch(), the error is a TypeError.
        // See fetch API spec: https://fetch.spec.whatwg.org/#fetch-api
        // > If response is a network error, then reject p with a TypeError and terminate these substeps.
        if (error instanceof TypeError) {
            logger.error(`Network error while calling ${input.toString()}`);
            logger.error(error);
            throw new NetworkError();
        }
        throw error;
    }
};
if (typeof window !== 'undefined') {
    const originalSetTimeout = globalThis.setTimeout;
    // @ts-ignore Undici uses Node Timeout since v6.20.0, we mimic it in dev mode as the server process runs in a
    // BrowserWindow, not in a Node process.
    globalThis.setTimeout = (callback, ms, ...args) => {
        const wrappedCallback = () => {
            callback.apply(this, args);
        };
        const timeoutId = originalSetTimeout.call(window, wrappedCallback, ms ?? 0);
        const timeout = {
            hasRef: () => true,
            ref: () => timeout,
            refresh: () => timeout,
            unref: () => timeout,
            [Symbol.toPrimitive]: () => Number(timeoutId),
            [Symbol.dispose]: () => {
                clearTimeout(timeoutId);
                return timeoutId;
            },
            close: () => {
                clearTimeout(timeoutId);
                return timeout;
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _onTimeout() { },
        };
        return timeout;
    };
}
export const server = new WebSocketServer();
process.on('message', function (message) {
    logger.debug('WS:: message from main process', message);
    if (message === 'ping') {
        process.send?.('pong');
    }
});
//# sourceMappingURL=server.js.map