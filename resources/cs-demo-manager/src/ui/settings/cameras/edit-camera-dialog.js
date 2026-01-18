import React, { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { NameInput } from 'csdm/ui/settings/cameras/form/name-input';
import { updateCameraSuccess } from 'csdm/ui/cameras/cameras-actions';
import { CameraForm } from './form/camera-form';
export function EditCameraDialog({ id }) {
    const { t } = useLingui();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const [error, setError] = useState(undefined);
    const submit = async (payload) => {
        try {
            const camera = await client.send({
                name: RendererClientMessageName.UpdateCamera,
                payload: { id, ...payload },
            });
            hideDialog();
            dispatch(updateCameraSuccess({ camera }));
        }
        catch (error) {
            setError(t `An error occurred`);
        }
    };
    return React.createElement(CameraForm, { onSubmit: submit, error: error, nameInput: React.createElement(NameInput, null) });
}
//# sourceMappingURL=edit-camera-dialog.js.map