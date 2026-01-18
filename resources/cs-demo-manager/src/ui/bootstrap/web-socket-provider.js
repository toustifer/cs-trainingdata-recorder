import React, { createContext, useRef, useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { WebSocketClient } from '../web-socket-client';
import { Loading } from './loading';
import { LoadingError } from './loading-error';
import { useRegisterWebSocketListeners } from './use-register-web-socket-listeners';
export const WebSocketContext = createContext(null);
export function WebSocketProvider({ children }) {
    const clientRef = useRef(null);
    const [status, setStatus] = useState(Status.Loading);
    const [error, setError] = useState('');
    const { t } = useLingui();
    const getClient = () => {
        if (clientRef.current === null) {
            const onConnectionSuccess = () => {
                setStatus(Status.Success);
            };
            const onConnectionError = (event) => {
                const code = event.code;
                setError(t `The connection to the WebSocket server failed with code ${code}.`);
                setStatus(Status.Error);
            };
            clientRef.current = new WebSocketClient(onConnectionSuccess, onConnectionError);
        }
        return clientRef.current;
    };
    const client = getClient();
    useRegisterWebSocketListeners(client);
    if (status === Status.Loading) {
        return React.createElement(Loading, null);
    }
    if (status === Status.Error) {
        return React.createElement(LoadingError, { title: React.createElement(Trans, null, "An error occurred connecting to the WebSocket server."), error: error });
    }
    return React.createElement(WebSocketContext.Provider, { value: client }, children);
}
//# sourceMappingURL=web-socket-provider.js.map