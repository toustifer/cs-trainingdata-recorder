import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { Demo } from 'csdm/ui/demo/demo';
import { Status } from 'csdm/common/types/status';
import { Message } from 'csdm/ui/components/message';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { ErrorCode } from 'csdm/common/error-code';
import { UpdateDemoLocation } from 'csdm/ui/match/video/update-demo-location';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { loadDemoSuccess } from './demo-actions';
import { isErrorCode } from 'csdm/common/is-error-code';
import { useNavigateToDemo } from 'csdm/ui/hooks/use-navigate-to-demo';
export function DemoLoader() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const params = useParams();
    const demoPath = decodeURIComponent(params.path);
    const location = useLocation();
    const [status, setStatus] = useState(Status.Loading);
    const [errorCode, setErrorCode] = useState(ErrorCode.UnknownError);
    const navigateToDemo = useNavigateToDemo();
    useEffect(() => {
        const loadDemo = async () => {
            try {
                setStatus(Status.Loading);
                const demo = await client.send({
                    name: RendererClientMessageName.LoadDemoByPath,
                    payload: demoPath,
                });
                dispatch(loadDemoSuccess(demo));
                setStatus(Status.Success);
            }
            catch (error) {
                const errorCode = isErrorCode(error) ? error : ErrorCode.UnknownError;
                setErrorCode(errorCode);
                setStatus(Status.Error);
            }
        };
        loadDemo();
    }, [client, dispatch, demoPath]);
    if (status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading demo\u2026") });
    }
    if (status === Status.Error) {
        if (errorCode === ErrorCode.DemoNotFound) {
            if (location.state?.checksum !== undefined) {
                return (React.createElement(UpdateDemoLocation, { demoFilePath: demoPath, checksum: location.state.checksum, onUpdated: (demoPath) => {
                        navigateToDemo(demoPath);
                    } }));
            }
            return React.createElement(Message, { message: React.createElement(Trans, null, "Demo not found.") });
        }
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred while loading demo.") });
    }
    return React.createElement(Demo, null);
}
//# sourceMappingURL=demo-loader.js.map