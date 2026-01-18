import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { AddSequenceDialog } from 'csdm/ui/match/video/sequences/add-sequence-dialog';
import { useCurrentMatchSequences } from './use-current-match-sequences';
export function AddNewSequenceButton() {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const sequences = useCurrentMatchSequences();
    const variant = sequences.length > 0 ? ButtonVariant.Default : ButtonVariant.Primary;
    const onClick = () => {
        setIsDialogVisible(true);
    };
    const closeDialog = () => {
        setIsDialogVisible(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { onClick: onClick, variant: variant },
            React.createElement(Trans, { context: "Button" }, "Add new sequence")),
        React.createElement(AddSequenceDialog, { isVisible: isDialogVisible, closeDialog: closeDialog })));
}
//# sourceMappingURL=add-new-sequence-button.js.map