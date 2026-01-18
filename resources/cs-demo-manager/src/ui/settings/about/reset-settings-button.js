import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { ErrorMessage } from 'csdm/ui/components/error-message';
function ResetSettingsDialog() {
    const [error, setError] = useState(undefined);
    const [isBusy, setIsBusy] = useState(false);
    const onConfirmClick = async () => {
        try {
            setIsBusy(true);
            await window.csdm.resetSettings();
            window.csdm.reloadWindow();
        }
        catch (error) {
            logger.error(error);
            if (typeof error === 'string') {
                setError(error);
            }
            else {
                setError(JSON.stringify(error));
            }
        }
        setIsBusy(false);
    };
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, { context: "Dialog title" }, "Reset settings"), onConfirm: onConfirmClick, closeOnConfirm: false, isBusy: isBusy, confirmButtonVariant: ButtonVariant.Danger },
        React.createElement("p", null,
            React.createElement(Trans, null, "It will reset settings excepted database information!")),
        error !== undefined && (React.createElement("div", { className: "mt-8" },
            React.createElement(ErrorMessage, { message: error })))));
}
export function ResetSettingsButton() {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(ResetSettingsDialog, null));
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, null, "Reset settings")));
}
//# sourceMappingURL=reset-settings-button.js.map