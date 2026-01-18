import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useSequenceForm } from '../use-sequence-form';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { GenerateCamerasDialog } from './generate-cameras-dialog';
export function ManageCamerasButtons() {
    const { showDialog } = useDialog();
    const sequenceContext = useSequenceForm();
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(Button, { onClick: () => {
                showDialog(React.createElement(GenerateCamerasDialog, { sequenceContext: sequenceContext }));
            } },
            React.createElement(Trans, { context: "Button" }, "Generate")),
        React.createElement(Button, { onClick: sequenceContext.clearPlayerCameras },
            React.createElement(Trans, { context: "Button" }, "Clear"))));
}
//# sourceMappingURL=manage-player-cameras-buttons.js.map