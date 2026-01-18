import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Dialog, DialogContent, DialogFooter } from 'csdm/ui/dialogs/dialog';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
export function DemoNotFoundDialog({ demoPath }) {
    const { hideDialog } = useDialog();
    return (React.createElement(Dialog, null,
        React.createElement(DialogContent, null,
            React.createElement("p", null,
                React.createElement(Trans, null, "Demo not found.")),
            React.createElement("p", null, demoPath)),
        React.createElement(DialogFooter, null,
            React.createElement(CloseButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=demo-not-found-dialog.js.map