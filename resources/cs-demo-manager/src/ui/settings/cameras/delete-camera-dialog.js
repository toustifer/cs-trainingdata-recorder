import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Status } from 'csdm/common/types/status';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { deleteCameraSuccess } from 'csdm/ui/cameras/cameras-actions';
export function DeleteCameraDialog({ cameraId }) {
    const client = useWebSocketClient();
    const [status, setStatus] = useState(Status.Idle);
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const onConfirmClick = async () => {
        try {
            setStatus(Status.Loading);
            await client.send({
                name: RendererClientMessageName.DeleteCamera,
                payload: cameraId,
            });
            hideDialog();
            dispatch(deleteCameraSuccess({ cameraId }));
        }
        catch (error) {
            setStatus(Status.Error);
        }
    };
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Delete camera"), onConfirm: onConfirmClick, closeOnConfirm: false, isBusy: status === Status.Loading },
        React.createElement("div", { className: "gap-y-8" },
            React.createElement("p", null,
                React.createElement(Trans, null, "Do you want to delete this camera?")),
            status === Status.Error && React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "An error occurred.") }))));
}
//# sourceMappingURL=delete-camera-dialog.js.map