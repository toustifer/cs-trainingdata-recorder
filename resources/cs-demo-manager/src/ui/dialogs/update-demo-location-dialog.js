import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { ErrorCode } from 'csdm/common/error-code';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from '../components/dialogs/use-dialog';
import { useUpdateDemoLocation } from '../hooks/use-update-demo-location';
import { ErrorMessage } from '../components/error-message';
export function UpdateDemoLocationDialog({ checksum, demoFilePath }) {
    const { t } = useLingui();
    const [error, setError] = useState(undefined);
    const { hideDialog } = useDialog();
    const updateDemoLocation = useUpdateDemoLocation();
    const onUpdateLocationClick = async () => {
        try {
            await updateDemoLocation(checksum);
            setError(undefined);
            hideDialog();
        }
        catch (error) {
            if (error === ErrorCode.ChecksumsMismatch) {
                setError(t `This demo checksum doesn't match the one associated with the match.`);
            }
            else {
                setError(t `An error occurred while updating demo location.`);
            }
        }
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, null, "Demo location"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex max-w-[700px] flex-col gap-y-8 break-all" },
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "The demo located at ",
                        React.createElement("code", { className: "selectable" }, demoFilePath),
                        " doesn't exists.")),
                error !== undefined && React.createElement(ErrorMessage, { message: error }))),
        React.createElement(DialogFooter, null,
            React.createElement(Button, { onClick: onUpdateLocationClick },
                React.createElement(Trans, { context: "Button" }, "Update demo location")),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=update-demo-location-dialog.js.map