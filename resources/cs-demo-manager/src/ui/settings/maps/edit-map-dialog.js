import React, { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { updateMapSuccess } from 'csdm/ui/maps/maps-actions';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { MapFormDialog } from 'csdm/ui/settings/maps/map-dialog/map-form-dialog';
import { NameInput } from 'csdm/ui/settings/maps/map-dialog/name-input';
export function EditMapDialog() {
    const { t } = useLingui();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const [error, setError] = useState(undefined);
    const submit = async (payload) => {
        try {
            const map = await client.send({
                name: RendererClientMessageName.UpdateMap,
                payload,
            });
            hideDialog();
            dispatch(updateMapSuccess({ map }));
        }
        catch (error) {
            setError(t `An error occurred`);
        }
    };
    return React.createElement(MapFormDialog, { onSubmit: submit, error: error, nameInput: React.createElement(NameInput, { isDisabled: true }) });
}
//# sourceMappingURL=edit-map-dialog.js.map