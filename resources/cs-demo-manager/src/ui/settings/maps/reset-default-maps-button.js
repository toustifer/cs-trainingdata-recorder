import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { resetMaps } from 'csdm/ui/maps/maps-actions';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { Status } from 'csdm/common/types/status';
import { ErrorMessage } from 'csdm/ui/components/error-message';
function ResetDefaultMapsDialog({ game }) {
    const [status, setStatus] = useState(Status.Idle);
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const onConfirm = async () => {
        try {
            setStatus(Status.Loading);
            const maps = await client.send({
                name: RendererClientMessageName.ResetMaps,
                payload: game,
            });
            dispatch(resetMaps({ maps }));
            hideDialog();
        }
        catch (error) {
            setStatus(Status.Error);
        }
    };
    const isLoading = status === Status.Loading;
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, { context: "Dialog title" }, "Reset maps"), onConfirm: onConfirm, closeOnConfirm: false, blockNavigation: isLoading, isBusy: isLoading },
        React.createElement("p", null,
            React.createElement(Trans, null, "It will reset default maps.")),
        status === Status.Error && React.createElement(ErrorMessage, { message: React.createElement(Trans, null, "An error occurred.") })));
}
export function ResetDefaultMapsButton({ game }) {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(ResetDefaultMapsDialog, { game: game }));
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Reset default maps")));
}
//# sourceMappingURL=reset-default-maps-button.js.map