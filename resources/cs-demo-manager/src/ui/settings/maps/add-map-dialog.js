import React, { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { addMapSuccess } from 'csdm/ui/maps/maps-actions';
import { ErrorCode } from 'csdm/common/error-code';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { MapFormDialog } from 'csdm/ui/settings/maps/map-dialog/map-form-dialog';
import { NameInput } from 'csdm/ui/settings/maps/map-dialog/name-input';
export function AddMapDialog() {
    const { t } = useLingui();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const [error, setError] = useState(undefined);
    const submit = async (payload) => {
        try {
            const map = await client.send({
                name: RendererClientMessageName.AddMap,
                payload,
            });
            hideDialog();
            dispatch(addMapSuccess({ map }));
        }
        catch (error) {
            let errorMessage;
            if (error === ErrorCode.MapAlreadyExists) {
                errorMessage = t `This map already exists.`;
            }
            else {
                errorMessage = t `An error occurred`;
            }
            setError(errorMessage);
        }
    };
    return React.createElement(MapFormDialog, { onSubmit: submit, error: error, nameInput: React.createElement(NameInput, null) });
}
//# sourceMappingURL=add-map-dialog.js.map