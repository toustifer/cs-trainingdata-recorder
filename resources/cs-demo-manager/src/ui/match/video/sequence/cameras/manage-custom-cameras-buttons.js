import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useSequenceForm } from '../use-sequence-form';
export function ManageCustomCamerasButtons() {
    const sequenceContext = useSequenceForm();
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(Button, { onClick: sequenceContext.clearCustomCameras },
            React.createElement(Trans, { context: "Button" }, "Clear"))));
}
//# sourceMappingURL=manage-custom-cameras-buttons.js.map