import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
export function AddVideoToQueueErrorDialog({ children }) {
    const { hideDialog } = useDialog();
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Error"))),
        React.createElement(DialogContent, null, children),
        React.createElement(DialogFooter, null,
            React.createElement(CloseButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=add-video-to-queue-error-dialog.js.map