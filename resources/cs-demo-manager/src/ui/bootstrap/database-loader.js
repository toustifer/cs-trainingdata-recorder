import React, { useEffect } from 'react';
import {} from 'react';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { Loading } from './loading';
import { useWebSocketClient } from '../hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDatabaseStatus } from './use-database-status';
import { ConnectDatabase } from './connect-database/connect-database';
import { DatabaseStatus } from './database-status';
import { connectDatabaseSuccess, connectDatabaseError } from './bootstrap-actions';
export function DatabaseLoader({ children }) {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const databaseStatus = useDatabaseStatus();
    useEffect(() => {
        if (databaseStatus !== DatabaseStatus.Idle) {
            return;
        }
        const connectDatabase = async () => {
            const error = await client.send({
                name: RendererClientMessageName.ConnectDatabase,
                payload: undefined,
            });
            if (error) {
                dispatch(connectDatabaseError({ error }));
            }
            else {
                dispatch(connectDatabaseSuccess());
            }
        };
        connectDatabase();
    }, [databaseStatus, client, dispatch]);
    if (databaseStatus === DatabaseStatus.Idle) {
        return React.createElement(Loading, null);
    }
    if (databaseStatus === DatabaseStatus.Error || databaseStatus === DatabaseStatus.Disconnected) {
        return React.createElement(ConnectDatabase, null);
    }
    return children;
}
//# sourceMappingURL=database-loader.js.map