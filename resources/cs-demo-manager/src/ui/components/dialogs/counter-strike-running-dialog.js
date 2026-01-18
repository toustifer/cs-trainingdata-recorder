import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
export function CounterStrikeRunningDialog({ onConfirmClick, closeOnConfirm = true }) {
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Counter-Strike is running"), onConfirm: onConfirmClick, closeOnConfirm: closeOnConfirm },
        React.createElement("p", null,
            React.createElement(Trans, null, "Counter-Strike is running.")),
        React.createElement("p", null,
            React.createElement(Trans, null, "Do you want to close the game and continue?"))));
}
//# sourceMappingURL=counter-strike-running-dialog.js.map