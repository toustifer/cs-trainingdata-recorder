import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { SpinnableButton } from '../components/buttons/spinnable-button';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from '../components/dialogs/use-dialog';
export function ConfirmDialog({ title, onConfirm, children, isBusy = false, blockNavigation = true, isConfirmButtonDisabled, confirmButtonVariant, closeOnConfirm = true, }) {
    const { hideDialog } = useDialog();
    const handleConfirm = () => {
        onConfirm();
        if (closeOnConfirm) {
            hideDialog();
        }
    };
    const onEnterKeyPressed = () => {
        if (!isBusy && !isConfirmButtonDisabled) {
            handleConfirm();
        }
    };
    return (React.createElement(Dialog, { onClose: hideDialog, closeOnBackgroundClicked: !isBusy, closeOnEscPressed: !isBusy, blockNavigation: blockNavigation, onEnterPressed: onEnterKeyPressed },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null, title)),
        React.createElement(DialogContent, null, children),
        React.createElement(DialogFooter, null,
            React.createElement(SpinnableButton, { onClick: handleConfirm, isLoading: isBusy, isDisabled: isConfirmButtonDisabled, variant: confirmButtonVariant },
                React.createElement(Trans, { context: "Button" }, "Confirm")),
            React.createElement(CancelButton, { onClick: hideDialog, isDisabled: isBusy }))));
}
//# sourceMappingURL=confirm-dialog.js.map