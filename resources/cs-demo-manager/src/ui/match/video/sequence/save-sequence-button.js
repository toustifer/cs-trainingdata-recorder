import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Dialog, DialogContent, DialogFooter } from 'csdm/ui/dialogs/dialog';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { SaveButton } from 'csdm/ui/components/buttons/save-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useSequenceForm } from './use-sequence-form';
export function SaveSequenceButton({ onClick, closeDialog }) {
    const { showDialog, hideDialog } = useDialog();
    const { sequence } = useSequenceForm();
    const handleClick = () => {
        const { startTick, endTick } = sequence;
        if (Number(endTick) <= Number(startTick)) {
            showDialog(React.createElement(Dialog, null,
                React.createElement(DialogContent, null,
                    React.createElement(Trans, null, "End tick must be greater than start tick")),
                React.createElement(DialogFooter, null,
                    React.createElement(CloseButton, { onClick: hideDialog }))));
        }
        else {
            closeDialog();
            onClick(sequence);
        }
    };
    return React.createElement(SaveButton, { onClick: handleClick });
}
//# sourceMappingURL=save-sequence-button.js.map