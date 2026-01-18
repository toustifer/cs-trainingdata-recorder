import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { CameraFormProvider } from './form/camera-form-provider';
import { AddCameraDialog } from './add-camera-dialog';
export function AddCameraButton({ game, mapName }) {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(CameraFormProvider, { game: game, mapName: mapName },
            React.createElement(AddCameraDialog, null)));
    };
    return (React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
        React.createElement(Trans, { context: "Button" }, "Add a camera")));
}
//# sourceMappingURL=add-camera-button.js.map