import { WEB_SOCKET_SERVER_PORT } from 'csdm/server/port';
import { SharedServerMessageName } from 'csdm/server/shared-server-message-name';
export class WebSocketClient {
    messageQueue = [];
    listeners = new Map();
    replyHandlers = new Map();
    socket;
    isConnected = false;
    onConnectionSuccess;
    onConnectionError;
    constructor(onConnectionSuccess, onConnectionError) {
        this.onConnectionError = onConnectionError;
        this.onConnectionSuccess = onConnectionSuccess;
        this.connect();
    }
    on = (name, listener) => {
        const listeners = this.listeners.get(name);
        if (listeners === undefined) {
            this.listeners.set(name, [listener]);
        }
        else {
            listeners.push(listener);
        }
    };
    off = (name, listener) => {
        const listeners = this.listeners.get(name);
        if (listeners === undefined) {
            return;
        }
        this.listeners.set(name, listeners.filter((cb) => cb !== listener));
    };
    removeAllEventListeners = (name) => {
        this.listeners.set(name, []);
    };
    /**
     * Send a message to the WebSocket server.
     * The promise will be resolved when the reply handler is called, i.e. when this client receives the response.
     *
     * You can wait for the response result like this:
     *   const result = await client.send({ name: 'message-name' });
     *   console.log(result);
     * Or you may don't wait the response and use listeners instead:
     *   const onMessage = (result) => {
     *     console.log(result);
     *     client.off('message-name', onMessage);
     *   }
     *   client.on('message-name', onMessage);
     *   client.send({ name: 'message-name' });
     */
    send = (message) => {
        return new Promise((resolve, reject) => {
            const uuid = window.crypto.randomUUID();
            message.uuid = uuid;
            this.replyHandlers.set(uuid, { resolve, reject });
            if (this.isConnected) {
                this.socket.send(JSON.stringify(message));
            }
            else {
                this.messageQueue.push(message);
            }
        });
    };
    connect = () => {
        logger.log('WS:: connecting to server');
        const url = `ws://localhost:${WEB_SOCKET_SERVER_PORT}?process=renderer`;
        this.socket = new WebSocket(url);
        this.socket.addEventListener('open', this.onConnect);
        this.socket.addEventListener('close', this.onDisconnect);
    };
    onConnect = () => {
        logger.log('WS:: connected');
        this.isConnected = true;
        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('close', this.onDisconnect);
        this.socket.addEventListener('error', this.onError);
        this.onConnectionSuccess();
        for (const message of this.messageQueue) {
            this.send(message);
        }
        this.messageQueue = [];
    };
    onDisconnect = (event) => {
        logger.warn('WS:: disconnected');
        this.isConnected = false;
        this.onConnectionError(event);
        this.connect();
    };
    onError = (event) => {
        logger.error('WS:: error', event);
        this.isConnected = false;
        this.connect();
    };
    onMessage = (messageEvent) => {
        try {
            const message = JSON.parse(messageEvent.data);
            const { name, payload, uuid } = message;
            switch (name) {
                case SharedServerMessageName.Reply:
                    {
                        if (uuid === undefined) {
                            logger.log(`WS:: missing uuid for message with name: "${name}", can't retrieve its reply handler`);
                            return;
                        }
                        const replyHandler = this.replyHandlers.get(uuid);
                        if (replyHandler) {
                            replyHandler.resolve(payload);
                            this.replyHandlers.delete(uuid);
                        }
                        else {
                            logger.log(`WS:: no reply handler for message with name: "${name}" and uuid ${uuid}`);
                        }
                    }
                    break;
                case SharedServerMessageName.ReplyError:
                    {
                        if (uuid === undefined) {
                            logger.log(`WS:: missing uuid for message with name: "${name}", can't retrieve its reply handler`);
                            return;
                        }
                        const replyHandler = this.replyHandlers.get(uuid);
                        if (replyHandler) {
                            replyHandler.reject(payload);
                            this.replyHandlers.delete(uuid);
                        }
                        else {
                            logger.log(`WS:: no reply handler for message with name: "${name}" and uuid ${uuid}`);
                        }
                    }
                    break;
                default: {
                    logger.log(`WS:: message with name "${name}" received from server`);
                    const listeners = this.listeners.get(name);
                    if (listeners) {
                        for (const listener of listeners) {
                            listener(payload);
                        }
                    }
                    else {
                        logger.log(`WS:: no listener for message with name: "${name}"`);
                    }
                }
            }
        }
        catch (error) {
            logger.error('WS:: Error on message:');
            logger.error(error);
        }
    };
}
//# sourceMappingURL=web-socket-client.js.map